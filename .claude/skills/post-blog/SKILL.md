---
name: post-blog
description: Write and publish a blog post or status update on a GitingSocial profile site. Use when the user wants to post, blog, publish a status update, edit a post, or unpublish something on their GitingSocial site.
---

# Posting on GitingSocial

A GitingSocial profile is a git repo. Publishing is a commit; there is no CMS.
The publish workflow (GitHub Actions) rebuilds the site and cuts a release on
every push to `main`.

## Blog post

Create `posts/YYYY-MM-DD-short-slug.md`:

```markdown
---
title: My post title
date: 2026-07-18
---

Body in markdown. Images work — put files in assets/ and reference them
as ![alt](../assets/pic.png) or with the full site URL.
```

Front matter is optional: title falls back to the first `#` heading or the
filename; date falls back to the filename's date prefix.

Commit with the `post:` type — this is what publishes it as a release:

```bash
git add posts/ && git commit -m "post: my post title" && git push
```

## Update (short status, no page)

Same, but add `type: update` to the front matter (`bulletin` is a legacy
alias). Updates show in the profile's Updates box and feed.json but get no
page and stay out of the blog. Commit with the `update:` type
(`update: shipped the thing`) — it cuts a patch release so followers are
notified, same as posts. Use `chore:` only if the user wants it silent.

## What a push does

- **`post:` / `update:` / `feat:` / `fix:` commit** → semantic-release cuts a GitHub
  Release (release notes = the feed entry followers see via `releases.atom`),
  AND the site rebuilds.
- **`chore:` / `docs:` commit** → site rebuilds only, no release. Use for
  profile edits, wall moderation.

The build commits generated `docs/` back to `main` itself — never edit `docs/`
by hand, and don't be surprised by `chore: rebuild site` bot commits.

## Edit or unpublish

- **Edit**: change the markdown file, commit `chore: edit post <slug>` (or
  `post:` if it deserves a fresh release), push.
- **Unpublish**: `git rm` the file, commit `chore: remove post <slug>`. The
  page and feed entry disappear on rebuild — but warn the user the content
  remains in git history and in any release already cut; true erasure needs a
  history rewrite plus release deletion.

## Verify

After pushing, the Actions run takes ~1 minute; the page appears at
`<site-url>/p/<slug>.html` and in `feed.json`. GitHub Pages caches for
~10 minutes, so hard-refresh or add `?x=1` when checking.
