---
title: I built a developer social site on GitHub (and you can join)
date: 2026-07-18
---

This page you're reading is not hosted on a social network. It **is** the social
network. The whole profile — the Top 8, the wall, the profile song, this blog
post — is a public git repo, rendered to a static site by GitHub Actions and
served free on GitHub Pages. I'm calling it **GitingSocial**: a place for repos.

## How it works

- **Your profile is a repo.** `profile.json` holds your name, bio, mood, away
  message, Top 8 repos, interests, and profile song. Every box on the page has
  a little ✎ pencil that opens the editor for the file behind it.
- **Posting is a commit.** This post is a markdown file in `posts/`. The commit
  that added it cut a GitHub Release — and every repo gets a free Atom feed of
  its releases, so that's the follow mechanism. No algorithm, no ranking:
  whoever you follow, you see, newest first.
- **Friends are files.** Following someone means adding a one-line JSON file to
  your `friends/` folder. A friend request is a pull request that adds *your*
  file to *their* folder. Merge to accept. My Friends page assembles a feed in
  your browser from each friend's `feed.json` — static files reading static
  files, no server anywhere.
- **The wall is a markdown file.** Sign it by PR. Moderation is code review.
- There's also a webring, 88×31 buttons, bulletins, and a marquee bio, because
  it's 2005 and I make the rules now.

Delete your repo and your data is gone from the network — because your repo
*was* your account. If GitHub vanished tomorrow, every member still has their
entire profile, posts, and social graph in a folder on their machine.

## Make yours (~2 minutes)

1. Go to [mcowser-p/GitingSocial-Template](https://github.com/mcowser-p/GitingSocial-Template)
   and hit **Use this template → Create a new repository**. Name it
   `<your-username>.github.io` (public) to get the root URL, or anything else
   for `<you>.github.io/<repo>/`.
2. **Settings → Pages** → Source: *Deploy from a branch* → `main`, folder `/docs`.
3. **Actions → publish → Run workflow** to force the first build.
4. Open your new site and start clicking pencils: put your name in
   `profile.json`, rank your Top 8, set a profile song (a YouTube link embeds
   the player).

Then sign my wall, or send me a friend request — there are buttons on the left.
Both are pull requests, which means the entire social site runs on the same
machinery as code review, which is the funniest possible way to run a social
network.

New template features ship as PRs to you too: **Actions → sync-template** pulls
the latest machinery without touching your content. And if you use Claude Code
or another agent, the repo ships skills that teach it to post, follow, and
handle friend requests for you.

Welcome to GitingSocial. A place for repos.
