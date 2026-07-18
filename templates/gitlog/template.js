// "gitlog" — commit-timeline profile. The original template.
// Contract: module.exports = (ctx) => { "relative/path": "file contents", ... }

module.exports = function render({ owner, repoFull, siteUrl, profile, posts, top8, fallbackAvatar, esc, marked }) {
  const CSS = `
:root{
  --paper:#F2F5F7; --ink:#16232D; --muted:#5A6B77;
  --accent:#F05133; --line:#D3DDE3; --card:#FFFFFF;
}
*{box-sizing:border-box}
body{
  margin:0; color:var(--ink); background:var(--paper);
  background-image:
    linear-gradient(rgba(22,35,45,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22,35,45,.045) 1px, transparent 1px);
  background-size:24px 24px;
  font:16px/1.65 "IBM Plex Sans", system-ui, sans-serif;
}
.mono{font-family:"IBM Plex Mono", ui-monospace, monospace}
.wrap{max-width:680px; margin:0 auto; padding:48px 20px 80px}
a{color:inherit; text-decoration-color:var(--accent); text-underline-offset:3px}
a:hover{color:var(--accent)}
a:focus-visible{outline:2px solid var(--accent); outline-offset:3px}

.profile{display:flex; gap:20px; align-items:flex-start; margin-bottom:12px}
.profile img{width:72px; height:72px; border-radius:10px; border:2px solid var(--ink); background:var(--card)}
.profile h1{font-family:"IBM Plex Mono",monospace; font-size:26px; line-height:1.2; margin:0}
.handle{color:var(--muted); font-size:14px}
.bio{margin:6px 0 0}
.meta-links{margin:16px 0 24px; font-size:13px; display:flex; gap:18px; flex-wrap:wrap}
.meta-links a{color:var(--muted); text-decoration:none; border-bottom:1px solid var(--line)}
.meta-links a:hover{color:var(--accent); border-color:var(--accent)}

.top8{margin:0 0 40px; font-size:13px; color:var(--muted)}
.top8 a{text-decoration:none; border-bottom:1px solid var(--line)}
.top8 a:hover{color:var(--accent); border-color:var(--accent)}

.feed{list-style:none; margin:0; padding:4px 0 0 30px; border-left:2px solid var(--line)}
.entry{position:relative; margin:0 0 34px}
.entry::before{
  content:""; position:absolute; left:-37px; top:8px;
  width:10px; height:10px; border-radius:50%;
  background:var(--accent); border:3px solid var(--paper);
}
.entry .oneline{font-size:13px; color:var(--muted); display:flex; gap:12px; flex-wrap:wrap}
.entry .hash{color:var(--accent)}
.entry h2{font-family:"IBM Plex Mono",monospace; font-size:19px; margin:4px 0 6px}
.entry h2 a{text-decoration:none}
.entry h2 a:hover{text-decoration:underline; text-decoration-color:var(--accent)}
.entry p{margin:0; color:var(--ink)}

.prose h1{font-family:"IBM Plex Mono",monospace; font-size:28px; line-height:1.25; margin:0 0 4px}
.prose .oneline{font-size:13px; color:var(--muted); margin-bottom:28px}
.prose .oneline .hash{color:var(--accent)}
.prose pre{background:var(--card); border:1px solid var(--line); border-radius:8px; padding:14px 16px; overflow-x:auto; font-size:14px}
.prose code{font-family:"IBM Plex Mono",monospace; font-size:.92em}
.prose img{max-width:100%; border-radius:8px}
.prose blockquote{margin:0; padding:2px 0 2px 16px; border-left:3px solid var(--accent); color:var(--muted)}
.back{display:inline-block; margin-bottom:32px; font-size:13px; color:var(--muted); text-decoration:none}
.back:hover{color:var(--accent)}
footer{margin-top:64px; font-size:12px; color:var(--muted)}
@media (prefers-reduced-motion: no-preference){
  a{transition:color .12s ease}
}
`;

  const shell = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${siteUrl}style.css">
<link rel="alternate" type="application/atom+xml" href="https://github.com/${repoFull}/releases.atom">
</head>
<body><div class="wrap">${body}</div></body>
</html>`;

  const oneline = (p) =>
    `<span class="oneline mono"><span class="hash">${p.hash}</span><span>${esc(p.date)}</span></span>`;

  const header = `
<div class="profile">
  <img src="${esc(profile.avatar)}" onerror="this.onerror=null;this.src='${fallbackAvatar}'" alt="">
  <div>
    <h1>${esc(profile.name)}</h1>
    <div class="handle mono">@${esc(owner)}</div>
    <p class="bio">${esc(profile.bio || "")}</p>
  </div>
</div>
<nav class="meta-links mono">
  <a href="https://github.com/${repoFull}">source</a>
  <a href="https://github.com/${repoFull}/releases">changelog</a>
  <a href="https://github.com/${repoFull}/releases.atom">follow (atom)</a>
  ${profile.links && profile.links.website ? `<a href="${esc(profile.links.website)}">website</a>` : ""}
</nav>
${
  top8.length
    ? `<p class="top8 mono">top ${top8.length}: ${top8
        .map((r) => `<a href="${esc(r.url)}">${esc(r.repo)}</a>`)
        .join(" · ")}</p>`
    : ""
}`;

  const feedItems = posts
    .map(
      (p) => `<li class="entry">
  ${oneline(p)}
  <h2><a href="${siteUrl}p/${esc(p.slug)}.html">${esc(p.title)}</a></h2>
  <p>${esc(p.excerpt)}</p>
</li>`
    )
    .join("\n");

  const files = {
    "style.css": CSS,
    "index.html": shell(
      `${profile.name} · git log`,
      `${header}
<ul class="feed">
${feedItems || '<li class="entry"><p>No posts yet. Commit one with <code class="mono">post: hello world</code>.</p></li>'}
</ul>
<footer class="mono">generated from <a href="https://github.com/${repoFull}">${repoFull}</a> · every post is a commit</footer>`
    ),
  };

  for (const p of posts) {
    files[`p/${p.slug}.html`] = shell(
      `${p.title} · ${profile.name}`,
      `<a class="back mono" href="${siteUrl}">&larr; git log</a>
<article class="prose">
  <h1>${esc(p.title)}</h1>
  ${oneline(p)}
  ${marked.parse(p.body)}
</article>`
    );
  }

  return files;
};
