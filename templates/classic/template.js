// "classic" — GitingSocial, a place for repos. 2005-era profile: blue header, two columns,
// contact box, extended-network banner, blurbs, Top 8 repos, blog entries.
// Contract: module.exports = (ctx) => { "relative/path": "file contents", ... }

module.exports = function render({ owner, repoFull, siteUrl, profile, posts, bulletins, top8, following, wall, wallFile, webring, fallbackAvatar, buildId, esc, marked }) {
  const name = profile.name || owner;
  const lastUpdate = posts.length ? posts[0].date : "never";
  const flair = profile.flair || {};
  const accent = /^#[0-9a-fA-F]{3,8}$/.test(profile.themeColor || "") ? profile.themeColor : "#FF6600";

  const CSS = `
*{box-sizing:border-box}
:root{
  --accent:${accent};
  --accent-soft:color-mix(in srgb, ${accent} 30%, white);
  --accent-dark:color-mix(in srgb, ${accent} 55%, black);
}
body{margin:0; background:#FFFFFF; color:#000;
  font:13px/1.5 Verdana, Arial, Helvetica, sans-serif}
a{color:#003399}
a:hover{color:#FF6600; color:var(--accent)}

.topbar{background:linear-gradient(#1B3F7C,#30549B); color:#fff; padding:8px 14px;
  display:flex; align-items:baseline; gap:10px; flex-wrap:wrap}
.topbar .logo{font:bold 22px Arial, sans-serif; letter-spacing:-1px}
.topbar .logo a{color:#fff; text-decoration:none}
.topbar .logo-accent{color:#9FC1F0}
.topbar .tagline{font-size:11px; color:#C5D3EE}
.navbar{background:#6699CC; padding:4px 14px; font-size:11px; font-weight:bold}
.navbar a{color:#fff; text-decoration:none; margin-right:4px}
.navbar a:hover{text-decoration:underline}
.navbar span{color:#BFD5EA}

.wrap{max-width:840px; margin:10px auto 40px; padding:0 10px}
.cols{display:flex; gap:12px; align-items:flex-start; flex-wrap:wrap}
.left{width:300px; flex-shrink:0}
.right{flex:1; min-width:280px}
@media (max-width:660px){.left{width:100%}}

.box{border:1px solid #6699CC; margin-bottom:12px; background:#fff}
.box h3{margin:0; padding:3px 8px; font-size:12px}
.box h3 .editlink{float:right; font-weight:normal; font-size:11px; text-decoration:none; color:inherit; opacity:.75}
.box h3 .editlink:hover{opacity:1; text-decoration:underline}
.box .pad{padding:8px}
.blue h3{background:#6699CC; color:#fff}
.orange{border-color:#FFCC99; border-color:var(--accent-soft)}
.orange h3{background:#FFCC99; background:var(--accent-soft); color:#8B2500; color:var(--accent-dark)}
.orange h3 a{color:#8B2500; color:var(--accent-dark)}

.who{font:bold 17px Arial, sans-serif; margin:2px 0 8px}
.idcard{display:flex; gap:10px}
.idcard img.avatar{width:110px; height:110px; border:1px solid #999; background:#DDE3E8; object-fit:cover}
.idcard .facts{font-size:11px}
.idcard .facts div{margin-bottom:4px}
.online{color:#008A00; font-weight:bold; font-size:11px}
.online .dot{display:inline-block; width:8px; height:8px; border-radius:50%; background:#00C000; margin-right:3px}
@media (prefers-reduced-motion: no-preference){
  .online .dot{animation:blink 1.4s step-end infinite}
  @keyframes blink{50%{opacity:.25}}
}
.viewmy{font-size:11px; margin-top:8px}

.contact-grid{display:grid; grid-template-columns:1fr 1fr; gap:4px 10px; font-size:11px;
  background:#D5E8FB; padding:8px; margin:0}
.contact-grid a{text-decoration:none}
.contact-grid a:hover{text-decoration:underline}

.url-box{font-size:11px; word-break:break-all}

.dtable{width:100%; border-collapse:separate; border-spacing:2px; font-size:11px; margin:0}
.dtable td{padding:5px 6px; vertical-align:top}
.dtable .dlabel{background:#D5E8FB; color:#336699; font-weight:bold; width:36%}
.dtable .dval{background:#EFF6FD}
.dtable .dval b{color:#336699}
.dtable .sname{color:#003399}
.dtable .school-years{white-space:nowrap; width:26%}

.network{border:2px solid #000; text-align:center; padding:14px 8px; margin-bottom:12px;
  font:bold 15px Arial, sans-serif}
.network .accent{color:#FF6600; color:var(--accent)}

.blurbs .label{color:#FF6600; color:var(--accent); font-weight:bold; margin:0 0 4px}
.blurbs p{margin:0 0 10px}

.top8-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:8px}
@media (max-width:660px){.top8-grid{grid-template-columns:repeat(2,1fr)}}
.friend{text-align:center; font-size:11px; padding:6px 2px}
.friend img{width:72px; height:72px; border:1px solid #999; object-fit:cover; background:#DDE3E8}
.friend .fname{font-weight:bold; display:block; margin-top:3px; word-break:break-all}
.friend .fowner{color:#666; word-break:break-all}
.friend .fnote{color:#666; font-style:italic}
.top8-count{font-size:11px; padding:0 8px 6px; color:#333}

.blog-list{list-style:none; margin:0; padding:8px}
.blog-list li{margin-bottom:8px; font-size:12px}
.blog-list .bdate{color:#666; font-size:11px}
.view-all{font-size:11px; padding:0 8px 8px}

.postpage{max-width:640px; margin:10px auto 40px; padding:0 10px}
.post-body{font-size:13px}
.post-body pre{background:#F4F4F4; border:1px solid #CCC; padding:10px; overflow-x:auto; font-size:12px}
.post-body code{font-family:"Courier New", monospace}
.post-body img{max-width:100%}
.post-body blockquote{margin:0 0 10px; padding:2px 0 2px 12px; border-left:3px solid #FFCC99; color:#555}
.post-meta{font-size:11px; color:#666; margin-bottom:12px}
.back{font-size:11px}

.pagefoot{text-align:center; font-size:10px; color:#666; margin:30px 0}

.fentry{display:flex; gap:10px; padding:10px 8px; border-bottom:1px solid #FFE8D0; border-bottom-color:var(--accent-soft)}
.fentry:last-child{border-bottom:none}
.fentry img{width:50px; height:50px; border:1px solid #999; object-fit:cover; background:#DDE3E8; flex-shrink:0}
.fentry .fwho{font-size:11px; color:#666}
.fentry .fwho b{color:#003399}
.fentry .ftitle{font-weight:bold}
.fentry .fex{font-size:12px; color:#333; margin-top:2px}
.fstatus{padding:10px 8px; font-size:12px; color:#666}
.funreach{padding:4px 8px 10px; font-size:11px; color:#996}
.mutual{color:#008A00; font-weight:bold; font-size:10px; margin-left:4px}

.song-box audio{width:100%; margin-top:4px}
.song-box iframe{width:100%; max-width:100%; aspect-ratio:16/9; border:0; display:block}
.song-note{font-size:10px; color:#666}

.bulletin-list{list-style:none; margin:0; padding:8px; font-size:11px}
.bulletin-list li{margin-bottom:8px}
.bulletin-list .bdate{color:#666}

.guestbook-body{font-size:12px}
.guestbook-body ul{list-style:none; margin:0; padding:0}
.guestbook-body li{padding:8px 0; border-bottom:1px dashed #CCC}
.guestbook-body li:last-child{border-bottom:none}
.sign-cta{font-size:11px; margin-bottom:8px}

.button-box img{display:block; margin-bottom:6px}
.button-code{width:100%; height:56px; font:10px/1.4 "Courier New", monospace; border:1px solid #CCC; resize:none}
.btnwall{display:flex; flex-wrap:wrap; gap:6px; padding:8px}
.btnwall img{width:88px; height:31px; border:0; display:block}
.btnwall-note{font-size:10px; color:#666; padding:0 8px 8px}

.webring{text-align:center; font-size:11px; margin:24px 0 0; color:#666}
.webring a{text-decoration:none}
.webring a:hover{text-decoration:underline}

.spark{position:fixed; pointer-events:none; z-index:9999; font-size:12px; color:var(--accent);
  animation:sparkfade .7s ease-out forwards}
@keyframes sparkfade{to{opacity:0; transform:translateY(14px) scale(.3)}}
marquee{display:block}
`;

  const webringStrip = webring
    ? `<div class="webring">GitingSocial webring:
  <a href="${esc(webring.prev)}">&larr; prev</a> &middot;
  <a href="#" onclick="location.href=WEBRING[Math.floor(Math.random()*WEBRING.length)];return false">random</a> &middot;
  <a href="${esc(webring.next)}">next &rarr;</a>
</div>
<script>var WEBRING=${JSON.stringify(webring.sites).replace(/</g, "\\u003c")};</script>`
    : "";

  const sparkleScript = flair.sparkle
    ? `
<script>
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  var last = 0;
  addEventListener("mousemove", function (e) {
    var now = Date.now();
    if (now - last < 60) return;
    last = now;
    var s = document.createElement("span");
    s.className = "spark";
    s.textContent = "\\u2726";
    s.style.left = e.clientX + 6 + "px";
    s.style.top = e.clientY + 6 + "px";
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  });
}
</script>`
    : "";

  const chrome = (body) => `
<div class="topbar">
  <span class="logo"><a href="${siteUrl}">Giting<span class="logo-accent">Social</span></a></span>
  <span class="tagline">a place for repos</span>
</div>
<div class="navbar">
  <a href="${siteUrl}">Home</a> <span>|</span>
  <a href="${siteUrl}friends.html">Friends</a> <span>|</span>
  <a href="${siteUrl}wall.html">Wall</a> <span>|</span>
  <a href="https://github.com/${repoFull}">Source</a> <span>|</span>
  <a href="https://github.com/${esc(owner)}">GitHub</a>
</div>
${body}
${webringStrip}
<div class="pagefoot">&copy;2005-forever ${esc(name)} · generated from <a href="https://github.com/${repoFull}">${repoFull}</a> · every post is a commit</div>${sparkleScript}`;

  const shell = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${siteUrl}style.css?v=${buildId}">
<link rel="alternate" type="application/atom+xml" href="https://github.com/${repoFull}/releases.atom">
</head>
<body>${body}</body>
</html>`;

  // Edit pencils: every box links to the file that feeds it. The owner gets
  // GitHub's editor; visitors get the auto-fork-and-PR flow.
  const editIcon = (file, title) =>
    `<a class="editlink" href="https://github.com/${repoFull}/edit/main/${file}" title="${esc(title || `Edit ${file}`)}">&#9998;</a>`;
  const today = new Date().toISOString().slice(0, 10);
  const newPostUrl = `https://github.com/${repoFull}/new/main?filename=posts/${today}-my-new-post.md&value=${encodeURIComponent(
    `---\ntitle: My new post\ndate: ${today}\n---\n\nWrite your post here, then commit with a message like \`post: my new post\` to publish it as a release.\n`
  )}`;
  const newBulletinUrl = `https://github.com/${repoFull}/new/main?filename=posts/${today}-bulletin.md&value=${encodeURIComponent(
    `---\ntype: bulletin\ndate: ${today}\n---\n\nyour status here\n`
  )}`;

  // Details/Interests are free-form key/value maps from profile.json; a value
  // may itself be a map (rendered as bold sub-labels, the classic profile sites-style).
  const multiline = (s) => esc(String(s)).replace(/\n/g, "<br>");
  const kvRows = (obj) =>
    Object.entries(obj)
      .map(
        ([k, v]) => `<tr><td class="dlabel">${esc(k)}</td><td class="dval">${
          typeof v === "object" && v !== null
            ? Object.entries(v)
                .map(([sk, sv]) => `<b>${esc(sk)}:</b> ${multiline(sv)}`)
                .join("<br><br>")
            : multiline(v)
        }</td></tr>`
      )
      .join("\n");

  // A YouTube "song" renders as an embedded player instead of an <audio> tag.
  const songYouTubeId = ((profile.song || "").match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,20})/
  ) || [])[1];

  const details = profile.details || {};
  const interests = profile.interests || {};
  const schools = profile.schools || [];
  const blurbs =
    profile.blurbs && Object.keys(profile.blurbs).length
      ? profile.blurbs
      : {
          "About me": profile.bio || "I put my whole profile in a git repo and all I got was this website.",
          "Who I'd like to meet": "Anyone with a green contribution graph and a feed reader.",
        };

  const friendCell = (r) => `<div class="friend">
  <a href="${esc(r.url)}"><img src="${esc(r.avatar)}" onerror="this.onerror=null;this.src='${fallbackAvatar}'" alt=""></a>
  <a class="fname" href="${esc(r.url)}">${esc(r.name)}</a>
  ${r.kind === "repo" ? `<span class="fowner">${esc(r.owner)}</span>` : ""}
  ${r.note ? `<span class="fnote">${esc(r.note)}</span>` : ""}
</div>`;

  const blogItems = posts
    .slice(0, 5)
    .map(
      (p) => `<li><span class="bdate">${esc(p.date)}</span> —
  <a href="${siteUrl}p/${esc(p.slug)}.html"><b>${esc(p.title)}</b></a>
  <a href="${siteUrl}p/${esc(p.slug)}.html">(view more)</a></li>`
    )
    .join("\n");

  const allBlogItems = posts
    .map(
      (p) => `<li><span class="bdate">${esc(p.date)}</span> —
  <a href="${siteUrl}p/${esc(p.slug)}.html"><b>${esc(p.title)}</b></a><br>${esc(p.excerpt)}</li>`
    )
    .join("\n");

  const indexBody = `
<div class="wrap">
<div class="cols">

  <div class="left">
    <div class="who">${esc(name)}</div>
    <div class="idcard">
      <img class="avatar" src="${esc(profile.avatar)}" onerror="this.onerror=null;this.src='${fallbackAvatar}'" alt="">
      <div class="facts">
        <div>${flair.marquee ? `<marquee scrollamount="3">"${esc(profile.bio || "no bio yet")}"</marquee>` : `"${esc(profile.bio || "no bio yet")}"`}</div>
        <div><b>@${esc(owner)}</b></div>
        ${profile.mood ? `<div><b>Mood:</b> ${esc(profile.mood)}</div>` : ""}
        ${profile.away ? `<div><b>Away:</b> <i>${esc(profile.away)}</i></div>` : ""}
        <div>Last Update:<br>${esc(lastUpdate)}</div>
        <div class="online"><span class="dot"></span>ONLINE NOW!</div>
      </div>
    </div>
    <div class="viewmy"><b>View My:</b> <a href="${siteUrl}blog.html">Blog</a> | <a href="https://github.com/${repoFull}/releases">Releases</a></div>

    <div style="height:10px"></div>

    <div class="box blue">
      <h3>Contacting ${esc(name)}</h3>
      <div class="contact-grid">
        <a href="https://github.com/${repoFull}/new/main?filename=friends/YOUR-USERNAME.json&value=${encodeURIComponent('{ "repo": "YOUR-USERNAME/YOUR-REPO" }\n')}" title="Add a file with your repo to my friends/ folder — the PR is the friend request">&#129309; Add to Friends</a>
        <a href="https://github.com/${repoFull}/fork">&#127860; Fork Me</a>
        <a href="https://github.com/${repoFull}/issues">&#128027; Report a Bug</a>
        <a href="https://github.com/${repoFull}">&#11088; Star Me</a>
        <a href="https://github.com/${repoFull}/releases.atom" title="Atom feed of my releases — point a feed reader at this">&#128225; Subscribe (RSS)</a>
        <a href="https://github.com/${repoFull}/edit/main/${wallFile}" title="Sign via pull request">&#9997;&#65039; Sign My Wall</a>
      </div>
    </div>
    ${
      profile.song
        ? `<div class="box blue song-box">
      <h3>${editIcon("profile.json", "Change your song")}Profile Song</h3>
      <div class="pad">
        ${
          songYouTubeId
            ? `<iframe src="https://www.youtube-nocookie.com/embed/${songYouTubeId}" title="Profile song" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>`
            : `<audio controls src="${esc(profile.song)}"></audio>`
        }
        <div class="song-note">no autoplay. we learned our lesson.</div>
      </div>
    </div>`
        : ""
    }
    ${
      bulletins.length
        ? `<div class="box blue">
      <h3><a class="editlink" href="${newBulletinUrl}" title="Post a bulletin">&#43; new</a>${esc(name)}'s Bulletins</h3>
      <ul class="bulletin-list">
${bulletins.map((b) => `        <li><span class="bdate">${esc(b.date)}</span> — ${esc(b.excerpt)}</li>`).join("\n")}
      </ul>
    </div>`
        : ""
    }
    ${
      Object.keys(details).length
        ? `<div class="box blue">
      <h3>${editIcon("profile.json", "Edit your details")}${esc(name)}'s Details</h3>
      <table class="dtable">
${kvRows(details)}
      </table>
    </div>`
        : ""
    }
    ${
      schools.length
        ? `<div class="box blue">
      <h3>${editIcon("profile.json", "Edit your schools")}${esc(name)}'s Schools</h3>
      <table class="dtable">
${schools
  .map(
    (s) => `        <tr><td class="dval"><span class="sname"><b>${esc(s.name)}</b></span>${
      s.place ? `<br>${multiline(s.place)}` : ""
    }${s.details ? `<br>${multiline(s.details)}` : ""}</td><td class="dval school-years">${esc(s.years || "")}</td></tr>`
  )
  .join("\n")}
      </table>
    </div>`
        : ""
    }
    ${
      Object.keys(interests).length
        ? `<div class="box blue">
      <h3>${editIcon("profile.json", "Edit your interests")}${esc(name)}'s Interests</h3>
      <table class="dtable">
${kvRows(interests)}
      </table>
    </div>`
        : ""
    }

    <div class="box blue">
      <h3>${esc(name)}'s URL</h3>
      <div class="pad url-box"><a href="${siteUrl}">${siteUrl}</a></div>
    </div>

    <div class="box blue button-box">
      <h3>${esc(name)}'s Button</h3>
      <div class="pad">
        <img src="${siteUrl}assets/button.svg" width="88" height="31" alt="${esc(name)}">
        <textarea class="button-code" readonly onclick="this.select()">${esc(`<a href="${siteUrl}"><img src="${siteUrl}assets/button.svg" width="88" height="31" alt="${name}"></a>`)}</textarea>
      </div>
    </div>
    ${
      profile.links && profile.links.website
        ? `<div class="box blue">
      <h3>${esc(name)}'s Links</h3>
      <div class="pad url-box"><a href="${esc(profile.links.website)}">${esc(profile.links.website)}</a></div>
    </div>`
        : ""
    }
  </div>

  <div class="right">
    <div class="network">${esc(name)} is in your <span class="accent">extended network</span></div>

    <div class="box orange">
      <h3><a class="editlink" href="${newPostUrl}" title="Write a new blog post">&#43; new entry</a>${esc(name)}'s Latest Blog Entries <a style="color:#8B2500" href="${siteUrl}blog.html">[View Blog]</a></h3>
      <ul class="blog-list">
${blogItems || "<li>No posts yet. Commit one with <b>post: hello world</b>.</li>"}
      </ul>
    </div>

    <div class="box orange blurbs">
      <h3>${editIcon("profile.json", "Edit your blurbs")}${esc(name)}'s Blurbs</h3>
      <div class="pad">
${Object.entries(blurbs)
  .map(([k, v]) => `        <p class="label">${esc(k)}:</p>\n        <p>${multiline(v)}</p>`)
  .join("\n")}
      </div>
    </div>

    ${
      top8.length
        ? `<div class="box orange">
      <h3>${editIcon("profile.json", "Edit your Top 8")}${esc(name)}'s Top ${top8.length}</h3>
      <div class="top8-count">${esc(name)} has <b>${top8.length}</b> repos in their Top ${top8.length}.</div>
      <div class="top8-grid">
${top8.map(friendCell).join("\n")}
      </div>
    </div>`
        : ""
    }

    <div class="box orange">
      <h3><a class="editlink" href="https://github.com/${repoFull}/edit/main/${wallFile}" title="Sign my wall">&#9997; sign</a>${esc(name)}'s Wall <a style="color:#8B2500" href="${siteUrl}wall.html">[View Wall]</a></h3>
      <div class="pad guestbook-body">
        ${wall ? marked.parse(wall) : `<p>No entries yet. <a href="https://github.com/${repoFull}/edit/main/${wallFile}">Be the first to sign</a>.</p>`}
      </div>
    </div>
  </div>

</div>
</div>`;

  // Friends feed: assembled in the visitor's browser from each followed site's
  // feed.json (GitHub Pages sends CORS * on static files — no API, no rate limits).
  // Friend data is external input, so it's rendered with textContent, never innerHTML.
  const friendsData = JSON.stringify(following).replace(/</g, "\\u003c");
  const friendsScript = `
<script>
var FRIENDS = ${friendsData};
var FALLBACK = ${JSON.stringify(fallbackAvatar)};
var MYREPO = ${JSON.stringify(repoFull)};
var list = document.getElementById("flist");
var statusEl = document.getElementById("fstatus");

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

if (!FRIENDS.length) {
  statusEl.textContent = "Not following anyone yet. Add \\"owner/repo\\" entries to \\"following\\" in profile.json.";
} else {
  statusEl.textContent = "Loading " + FRIENDS.length + " friend feed(s)\\u2026";
  Promise.allSettled(
    FRIENDS.map(function (f) {
      return fetch(f.feed).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).then(function (d) { return { f: f, d: d }; });
    })
  ).then(function (results) {
    var entries = [], unreachable = [];
    results.forEach(function (res, i) {
      if (res.status !== "fulfilled") { unreachable.push(FRIENDS[i].repo); return; }
      var d = res.value.d, f = res.value.f;
      var who = (d.profile && d.profile.name) || d.owner || f.owner;
      var avatar = (d.profile && d.profile.avatar) || FALLBACK;
      var mutual = (d.following || []).some(function (x) { return x && x.repo === MYREPO; });
      (d.posts || []).forEach(function (p) {
        entries.push({ who: who, avatar: avatar, mutual: mutual, site: d.site || f.site, title: p.title, date: p.date, url: p.url, excerpt: p.excerpt });
      });
    });
    entries.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    statusEl.remove();
    if (!entries.length) list.appendChild(el("div", "fstatus", "No posts from friends yet."));
    entries.slice(0, 50).forEach(function (e) {
      var row = el("div", "fentry");
      var img = el("img");
      img.src = e.avatar;
      img.onerror = function () { this.onerror = null; this.src = FALLBACK; };
      row.appendChild(img);
      var body = el("div");
      var who = el("div", "fwho");
      var wa = el("a"); wa.href = e.site; var wb = el("b", null, e.who); wa.appendChild(wb);
      who.appendChild(wa);
      if (e.mutual) who.appendChild(el("span", "mutual", "\\u2713 follows you back"));
      who.appendChild(document.createTextNode(" posted \\u00b7 " + e.date));
      body.appendChild(who);
      var ta = el("a", "ftitle", e.title); ta.href = e.url;
      body.appendChild(ta);
      if (e.excerpt) body.appendChild(el("div", "fex", e.excerpt));
      row.appendChild(body);
      list.appendChild(row);
    });
    if (unreachable.length) {
      list.appendChild(el("div", "funreach", "Couldn\\u2019t reach: " + unreachable.join(", ")));
    }
  });
}
</script>`;

  const friendsBody = `<div class="postpage">
<p class="back"><a href="${siteUrl}">&laquo; Back to ${esc(name)}'s profile</a></p>
<div class="box orange">
  <h3>${esc(name)}'s Friends Feed</h3>
  <div id="fstatus" class="fstatus"></div>
  <div id="flist"></div>
</div>
${
  following.length
    ? `<div class="box orange">
  <h3>Button Wall</h3>
  <div class="btnwall">
${following
  .map(
    (f) => `    <a href="${esc(f.site)}"><img src="${esc(f.site)}assets/button.svg" alt="${esc(f.repo)}" onerror="this.parentNode.style.display='none'"></a>`
  )
  .join("\n")}
  </div>
  <div class="btnwall-note">88&times;31 buttons from the sites ${esc(name)} follows.</div>
</div>`
    : ""
}
</div>${friendsScript}`;

  const files = {
    "style.css": CSS,
    "index.html": shell(`${name} | GitingSocial`, chrome(indexBody)),
    "friends.html": shell(`${name}'s Friends Feed | GitingSocial`, chrome(friendsBody)),
    "wall.html": shell(
      `${name}'s Wall | GitingSocial`,
      chrome(`<div class="postpage">
<p class="back"><a href="${siteUrl}">&laquo; Back to ${esc(name)}'s profile</a></p>
<div class="box orange">
  <h3>${editIcon(wallFile, "Edit / moderate your wall")}${esc(name)}'s Wall</h3>
  <div class="pad guestbook-body">
    <div class="sign-cta">&#9997;&#65039; <a href="https://github.com/${repoFull}/edit/main/${wallFile}">Sign my wall</a> — add a line, open the pull request, and you're in when I merge.</div>
    ${wall ? marked.parse(wall) : "<p>No entries yet. Be the first!</p>"}
  </div>
</div>
</div>`)
    ),
    "blog.html": shell(
      `${name}'s Blog | GitingSocial`,
      chrome(`<div class="postpage">
<p class="back"><a href="${siteUrl}">&laquo; Back to ${esc(name)}'s profile</a></p>
<div class="box orange">
  <h3><a class="editlink" href="${newPostUrl}" title="Write a new blog post">&#43; new entry</a>${esc(name)}'s Blog</h3>
  <ul class="blog-list">
${allBlogItems || "<li>No posts yet.</li>"}
  </ul>
</div>
</div>`)
    ),
  };

  for (const p of posts) {
    files[`p/${p.slug}.html`] = shell(
      `${p.title} | ${name}'s Blog`,
      chrome(`<div class="postpage">
<p class="back"><a href="${siteUrl}">&laquo; Back to ${esc(name)}'s profile</a></p>
<div class="box orange">
  <h3>${editIcon(p.file, "Edit this post")}${esc(p.title)}</h3>
  <div class="pad post-body">
    <div class="post-meta">${esc(p.date)} · commit <b>${p.hash}</b></div>
    ${marked.parse(p.body)}
  </div>
</div>
</div>`)
    );
  }

  return files;
};
