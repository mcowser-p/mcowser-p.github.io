# GitingSocial — your profile, but it's a git repo

Posts are markdown files. Publishing is a commit. Updates are releases. Hosting is GitHub Pages. Everything runs on the built-in `GITHUB_TOKEN` — no app installs, no PATs, no secrets.

## Setup (once, ~2 minutes)

1. **Use this template** → create a **public** repo (public = free unlimited Actions + free Pages).
2. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/docs`.
3. **Add the topic** `gitsocial-demo` under the repo's About ⚙️ (top-right of the repo page). This is how the index finds you — topics can't be set by the workflow token, so it's the one manual click.
4. Edit `profile.json`, then go to **Actions → publish → Run workflow** to force the first build (the template-generation commit doesn't always trigger it).

(Or skip all four steps: if you have the `gh` CLI, run the network's `join.sh <template-owner>/<template-repo>` — it does the whole list.)

Your page appears at `https://<you>.github.io/<repo>/`.

## Posting

Write `posts/2026-07-18-my-thought.md` and commit it with a conventional-commit message:

```
git add posts/
git commit -m "post: my thought about whatever"
git push
```

That one push does two things in parallel:

- **release job** — semantic-release reads the commits, cuts a GitHub Release with generated notes (custom `post:` type maps to a patch release; `feat:`/`fix:` also work). Every repo gets `releases.atom` for free, so releases double as an RSS/Atom feed.
- **build job** — renders every post to HTML, writes `docs/` (site + `feed.json`), and commits it back to `main`. Commits pushed by the workflow token don't re-trigger workflows, so there's no loop.

Commit types that *aren't* releasable (`chore:`, `docs:`, etc.) still rebuild the site but don't cut a release — handy for profile edits.

## Templates

Pick a look in `profile.json` with `"template": "<name>"`:

- **`classic`** *(default)* — GitingSocial, a place for repos. Blue header, contact box, blurbs, "extended network" banner, and your **Top 8**. It's 2005 and your profile is a git repo.
- **`gitlog`** — minimal commit-timeline look.

Or build your own: copy any folder in `templates/`, rename it, and point `profile.json` at it. A template is one file, `templates/<name>/template.js`, exporting a function:

```js
module.exports = (ctx) => ({ "index.html": "...", "style.css": "...", ... });
```

It receives `{ owner, repo, repoFull, siteUrl, profile, posts, top8, esc, marked }` and returns a map of `docs/`-relative paths to file contents — plain JS template literals, no framework. Whatever you return is the site (plus `feed.json`, `.nojekyll`, and the default avatar, which are always generated).

### Top 8

Your Top 8 is a ranked grid of repos. List them in `profile.json` in order — projects you're working on, or just repos you like:

```json
"top8": ["octocat/Hello-World", { "repo": "git/git", "note": "the OG" }]
```

Entries are `owner/repo` strings, or objects with a `note`. Each cell shows the repo owner's avatar and links to the repo. Reordering the array reorders the grid — Top 8 drama, now via pull request.

### Following & the Friends Feed

Follow other GitingSocial sites by adding **one file per friend** to `friends/`:

```
friends/alice.json    →  { "repo": "alice/alice.github.io" }
```

The filename just needs to be unique; the `repo` inside is what counts. One file per friend means two friend requests arriving at once can never merge-conflict. (A legacy `"following"` array in `profile.json` still works too.)

Your site's **Friends** page assembles a merged, newest-first feed in the visitor's browser by fetching each friend's `feed.json` from their Pages site. No GitHub API, no rate limits, no server — Pages serves static files with open CORS, and each `feed.json` carries the friend's full post history, so following someone new backfills their entire back catalog instantly. Your own `feed.json` also publishes who you follow, so the social graph is crawlable site-to-site.

### Mood, away message, profile song & flair

All optional, all in `profile.json`:

```json
"mood": "extremely online",
"away": "brb, force pushing",
"song": "assets/song.mp3",
"themeColor": "#8B00FF",
"flair": { "marquee": true, "sparkle": true }
```

`mood` and `away` render under your avatar, AIM-style. `song` (a file in `assets/` or a URL) adds a Profile Song player — play is a button, never automatic; we all remember. `themeColor` reskins the accent color across the whole site. `flair.marquee` scrolls your bio in an honest-to-goodness `<marquee>`; `flair.sparkle` adds a cursor sparkle trail (auto-disabled for visitors with reduced-motion set).

### Blurbs, Details, Schools & Interests

The classic profile boxes, all optional, all free-form in `profile.json` — you pick the rows, nothing is hardcoded:

```json
"blurbs":    { "About me": "…", "Who I'd like to meet": "…" },
"details":   { "Status": "Committed", "Hometown": "localhost" },
"interests": { "General": "…", "Music": { "Bands": "…", "Instruments": "…" } },
"schools":   [{ "name": "…", "place": "…", "years": "1993 to 1996", "details": "Degree: …" }]
```

`details` and `interests` are label → text maps; an interests value can itself be a map for bold sub-sections (Bands, Solo Artists, …). Multi-line strings render as line breaks. Empty or missing = the box doesn't render.

### Bulletins

A post with `type: bulletin` in its front matter is a status, not an essay: it shows in a Bulletins box on your profile (and in `feed.json`) but gets no page and stays out of the blog. Same deal as posts otherwise — it's a markdown file and a commit.

### Guestbook

`guestbook.md` renders at `/guestbook.html`. Visitors sign it by pull request — the "Sign Guestbook" link opens GitHub's editor on the file, which forks and PRs automatically for non-collaborators. Merging the PR publishes the entry. Moderation is just code review.

### Friend requests

The "Add to Friends" contact link opens GitHub's new-file editor on **your** `friends/` folder, prefilled — someone who wants you to follow them drops in a file pointing at their repo and sends the PR. Merge to accept, close to reject. On the Friends feed, anyone you follow who also follows you gets a "✓ follows you back" badge (computed in the browser from their published follow list — no server, no API).

The repo also ships an agent skill at `.claude/skills/friend-request/SKILL.md`, so if you (or a friend) run Claude Code in a profile repo, it already knows the protocol: "follow alice" or "accept that friend request" just works.

### 88×31 buttons

Every site auto-generates the classic old-web badge at `assets/button.svg` — your name on a GitingSocial button, tinted with your `themeColor`. Your profile shows it with copy-paste embed code, and the Friends page has a **Button Wall** of badges from everyone you follow (fetched straight off their sites; members without a button are silently skipped). Drop your own `assets/button.svg` in the repo to hand-craft it — any 88×31 will do, it's tradition.

### Webring

If you follow anyone, every page gets a webring footer: ← prev · random · next → over the loop of you + everyone you follow, sorted alphabetically so any two members who follow each other compute compatible neighbors. The random button is the whole old web in one link.

### Avatar

`"avatar": ""` uses your GitHub profile picture; if it ever fails to load, the page falls back to the anonymous gray sitting cat (this is a social network, someone has to be the default silhouette). The cat is a real file at `assets/default-avatar.svg` — overwrite it with your own image to reskin the fallback. `"avatar": "cat"` forces the cat; any other value is used as an image URL.

## Files

```
profile.json          your name/bio/avatar/template/top8/links
posts/*.md            the content — front matter (title/date) optional
templates/<name>/     site themes — pick one in profile.json or add your own
scripts/build.js      markdown + template -> docs/ static site generator
docs/                 generated HTML + feed.json (committed back; this is what Pages serves)
.releaserc.json       semantic-release config (post: -> release)
```
