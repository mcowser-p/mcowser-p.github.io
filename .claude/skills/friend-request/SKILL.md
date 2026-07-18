---
name: friend-request
description: Follow a GitingSocial site or send/accept a friend request. Use when the user wants to follow someone on GitingSocial, friend them, send a friend request, accept one, or add/remove a friend from their profile site.
---

# GitingSocial friend requests

A GitingSocial profile is a git repo published on GitHub Pages. The social graph
lives in the repo's `friends/` folder: **one file per followed site**. There is
no server — every social action is a commit or a pull request.

## Data format

A friend file is `friends/<their-github-username>.json` containing:

```json
{ "repo": "owner/repo" }
```

`repo` is the *profile repo* of the site being followed (often
`username/username.github.io`). The filename only needs to be unique; the
content is what counts. One file per friend means concurrent friend-request
PRs never merge-conflict. Do not edit `profile.json` for following — that is
legacy.

## Info you need (gather before acting)

1. **The user's own profile repo** — from `git remote get-url origin` in their
   profile repo checkout, or ask.
2. **The target's profile repo** — if you only have their site URL, fetch
   `<site-url>/feed.json`; its `repo` field is authoritative. A site URL like
   `https://alice.github.io/` usually means repo `alice/alice.github.io`.

## Follow someone (their repo appears in MY feed)

Add a file to the **user's own** repo — no permission needed:

```bash
echo '{ "repo": "TARGET_OWNER/TARGET_REPO" }' > friends/TARGET_OWNER.json
git add friends/ && git commit -m "chore: follow TARGET_OWNER/TARGET_REPO" && git push
```

`chore:` rebuilds the site without cutting a release. The Friends page,
webring, and button wall update on the next build automatically.

## Send a friend request (ask THEM to follow ME)

Open a PR that adds a file with the **user's** repo to the **target's**
`friends/` folder:

```bash
gh repo fork TARGET_OWNER/TARGET_REPO --clone friend-req && cd friend-req
echo '{ "repo": "MY_OWNER/MY_REPO" }' > friends/MY_OWNER.json
git checkout -b friend-request && git add friends/
git commit -m "chore: friend request from @MY_OWNER"
git push -u origin friend-request
gh pr create --repo TARGET_OWNER/TARGET_REPO --title "friend request: @MY_OWNER" \
  --body "Add my site to your friends list: https://MY_OWNER.github.io/... — merge to accept."
```

Confirm with the user before opening the PR (it is outward-facing).

## Accept a friend request (incoming PR)

Before merging, verify the PR **only adds a file under `friends/`** and that
the `repo` inside points at the requester's own repo — nothing else should be
touched. Then `gh pr merge`. Merging is accepting; closing is declining.
Optionally follow back (see "Follow someone") — mutual follows show a
"follows you back" badge on both Friends pages.
