#!/usr/bin/env node
// Renders posts/*.md -> docs/ using the template named in profile.json.
// Templates live in templates/<name>/template.js — a function (ctx) => { "path": "content" }.
// No config needed: owner/repo and the Pages URL are derived from the Actions env.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { marked } = require("marked");

const repoFull = process.env.GITHUB_REPOSITORY || "you/your-repo";
const [owner, repo] = repoFull.split("/");
const siteUrl =
  repo.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? `https://${owner}.github.io/`
    : `https://${owner}.github.io/${repo}/`;

const profile = JSON.parse(fs.readFileSync("profile.json", "utf8"));

// Cache-buster appended to asset URLs (style.css?v=...) so a new deploy's HTML
// never renders with a stale cached stylesheet.
let buildId = String(Date.now());
try {
  buildId = execSync("git rev-parse --short HEAD").toString().trim() || buildId;
} catch {}

// Avatar: "" -> your GitHub avatar (falls back to the sitting-cat placeholder if it
// can't load), "cat" -> force the placeholder, anything else -> used verbatim as a URL.
// The placeholder is a real file at assets/default-avatar.svg — overwrite it to reskin.
const fallbackAvatar = `${siteUrl}assets/default-avatar.svg`;
if (!profile.avatar) profile.avatar = `https://github.com/${owner}.png`;
else if (profile.avatar === "cat") profile.avatar = fallbackAvatar;

// Profile song: a site-relative path (e.g. "assets/song.mp3") or a full URL.
if (profile.song && !/^https?:/.test(profile.song)) profile.song = siteUrl + profile.song.replace(/^\//, "");

// Top 8: entries are "owner/repo" strings (or { repo, note }), order is the ranking.
const top8 = (profile.top8 || [])
  .slice(0, 8)
  .map((e) => (typeof e === "string" ? { repo: e } : e))
  .filter((e) => e.repo && e.repo.includes("/"))
  .map((e) => {
    const [repoOwner, repoName] = e.repo.split("/");
    return {
      repo: e.repo,
      owner: repoOwner,
      name: repoName,
      note: e.note || "",
      url: `https://github.com/${e.repo}`,
      avatar: `https://github.com/${repoOwner}.png?size=80`,
    };
  });

// Following: one file per friend in friends/ — filename is arbitrary, content is
// {"repo": "owner/repo"} (or a bare "owner/repo" string). One-file-per-friend
// means concurrent friend-request PRs never conflict. profile.following (legacy
// array) still works and is merged in. Pages URLs derive like our own siteUrl.
const friendEntries = [...(profile.following || [])];
if (fs.existsSync("friends")) {
  for (const f of fs.readdirSync("friends").sort()) {
    if (f.startsWith(".") || f.toLowerCase() === "readme.md") continue;
    const raw = fs.readFileSync(path.join("friends", f), "utf8").trim();
    if (!raw) continue;
    try {
      friendEntries.push(JSON.parse(raw));
    } catch {
      friendEntries.push(raw);
    }
  }
}
const following = friendEntries
  .map((e) => (typeof e === "string" ? { repo: e } : e))
  .filter((e) => e.repo && e.repo.includes("/"))
  .map((e) => {
    const [fOwner, fRepo] = e.repo.split("/");
    const fSite =
      fRepo.toLowerCase() === `${fOwner.toLowerCase()}.github.io`
        ? `https://${fOwner}.github.io/`
        : `https://${fOwner}.github.io/${fRepo}/`;
    return { repo: e.repo, owner: fOwner, site: fSite, feed: `${fSite}feed.json` };
  })
  .filter((e, i, a) => a.findIndex((x) => x.repo === e.repo) === i);

// ---------- helpers ----------

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function frontMatter(raw) {
  // tiny ---\nkey: value\n--- parser; everything is optional
  if (!raw.startsWith("---")) return [{}, raw];
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return [{}, raw];
  const meta = {};
  for (const line of raw.slice(3, end).split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  }
  return [meta, raw.slice(end + 4).replace(/^\n/, "")];
}

function shortHash(file) {
  try {
    return execSync(`git log -1 --format=%h -- "${file}"`).toString().trim() || "0000000";
  } catch {
    return "0000000";
  }
}

function excerpt(md, n = 180) {
  const text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
}

// ---------- load posts ----------

const postsDir = "posts";
const allPosts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const file = path.join(postsDir, f);
    const [meta, body] = frontMatter(fs.readFileSync(file, "utf8"));
    const dateFromName = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
    const slug = f.replace(/^\d{4}-\d{2}-\d{2}-?/, "").replace(/\.md$/, "") || f.replace(/\.md$/, "");
    const heading = (body.match(/^#\s+(.+)$/m) || [])[1];
    return {
      slug,
      file: `${postsDir}/${f}`,
      type: (meta.type || "post").toLowerCase(),
      title: meta.title || heading || slug.replace(/[-_]/g, " "),
      date: meta.date || dateFromName || fs.statSync(file).mtime.toISOString().slice(0, 10),
      hash: shortHash(file),
      body: heading && !meta.title ? body.replace(/^#\s+.+$/m, "").trimStart() : body,
      excerpt: excerpt(body),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? 1 : -1));

// Bulletins (front matter `type: bulletin`) are short one-off statuses: they show
// on the profile but get no page of their own and stay out of the blog.
const bulletins = allPosts.filter((p) => p.type === "bulletin");
const posts = allPosts.filter((p) => p.type !== "bulletin");

// Guestbook: a markdown file visitors sign via PR. Rendered as-is by templates.
const guestbook = fs.existsSync("guestbook.md") ? fs.readFileSync("guestbook.md", "utf8") : "";

// Webring: a stable loop over you + everyone you follow (alphabetical), so every
// member's site computes compatible prev/next neighbors from its own follow list.
const ringSites = [...new Set([siteUrl, ...following.map((f) => f.site)])].sort();
const ringIdx = ringSites.indexOf(siteUrl);
const webring =
  ringSites.length > 1
    ? {
        prev: ringSites[(ringIdx - 1 + ringSites.length) % ringSites.length],
        next: ringSites[(ringIdx + 1) % ringSites.length],
        sites: ringSites,
      }
    : null;

// ---------- render via template ----------

const templateName = profile.template || "gitlog";
const templateFile = path.resolve("templates", templateName, "template.js");
if (!fs.existsSync(templateFile)) {
  const available = fs.readdirSync("templates").filter((d) => fs.existsSync(path.join("templates", d, "template.js")));
  console.error(`Unknown template "${templateName}" in profile.json. Available: ${available.join(", ")}`);
  process.exit(1);
}
const render = require(templateFile);

const ctx = { owner, repo, repoFull, siteUrl, profile, posts, bulletins, top8, following, guestbook, webring, fallbackAvatar, buildId, esc, marked };
const files = render(ctx);

// ---------- write docs/ ----------

fs.rmSync("docs", { recursive: true, force: true });
for (const [rel, content] of Object.entries(files)) {
  const out = path.join("docs", rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}

// Always shipped regardless of template: assets/ (placeholder avatar + anything you
// drop next to it), Jekyll opt-out, machine feed.
if (fs.existsSync("assets")) fs.cpSync("assets", "docs/assets", { recursive: true });
fs.writeFileSync("docs/.nojekyll", "");

// 88x31 button: the classic old-web badge, generated at a known URL
// (assets/button.svg) so members can show each other's buttons with no
// coordination. Drop your own assets/button.svg (or .png/.gif) to override.
if (!fs.existsSync("assets/button.svg")) {
  const accent = /^#[0-9a-fA-F]{3,8}$/.test(profile.themeColor || "") ? profile.themeColor : "#FF6600";
  const buttonName = (profile.name || owner).slice(0, 14);
  fs.writeFileSync(
    "docs/assets/button.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" role="img" aria-label="${esc(buttonName)}">
  <rect width="88" height="31" fill="#1B3F7C"/>
  <rect x="0" y="27" width="88" height="4" fill="${accent}"/>
  <rect x="0.5" y="0.5" width="87" height="30" fill="none" stroke="#9FC1F0"/>
  <text x="4" y="10" font-family="Verdana, sans-serif" font-size="7" fill="#9FC1F0">GitingSocial</text>
  <text x="4" y="23" font-family="Verdana, sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF">${esc(buttonName)}</text>
</svg>
`
  );
}
fs.writeFileSync(
  "docs/feed.json",
  JSON.stringify(
    {
      version: 1,
      owner,
      repo: repoFull,
      site: siteUrl,
      releases_atom: `https://github.com/${repoFull}/releases.atom`,
      profile,
      top8: top8.map(({ repo, url, note }) => ({ repo, url, note })),
      following,
      bulletins: bulletins.map((b) => ({ date: b.date, hash: b.hash, text: b.excerpt })),
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        hash: p.hash,
        url: `${siteUrl}p/${p.slug}.html`,
        excerpt: p.excerpt,
      })),
    },
    null,
    2
  )
);

console.log(`Built ${posts.length} post(s) with template "${templateName}" -> docs/ (${siteUrl})`);
