# your profile, but it's a git repo

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

## Files

```
profile.json        your name/bio/avatar/links (avatar defaults to your GitHub avatar)
posts/*.md          the content — front matter (title/date) optional
scripts/build.js    markdown -> docs/ static site generator
docs/               generated HTML + feed.json (committed back; this is what Pages serves)
.releaserc.json     semantic-release config (post: -> release)
```
