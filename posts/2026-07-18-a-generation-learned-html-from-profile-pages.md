---
title: A generation learned HTML from profile pages. Git's turn.
date: 2026-07-18
---

Nobody in 2005 signed up for a web development course. They signed up for a
profile page — and then they wanted a sparkly background, a custom cursor, an
autoplaying song, and their best friend moved up a row in the friend grid.

The way you got those things was HTML. You didn't *learn HTML* and then
customize your page; you customized your page and discovered afterward that
you'd learned HTML. View source. Copy the code. Paste it in the box. Change the
color. Refresh. A whole generation ran that loop ten thousand times, and a lot
of them are professional developers today because a `<marquee>` tag once did
exactly what they told it to.

The lesson wasn't about HTML at all. It's this: **people learn a tool when the
tool is bolted to their identity and their friends can see the result.**
Curriculum can't compete with vanity. Documentation can't compete with a
friend grid.

## The tool nobody learns that way anymore

Ask a new developer what the scariest part of their first job or first class
was. It's rarely the language. It's git — learned under pressure, from error
messages, usually the week something already went wrong. `detached HEAD`,
`merge conflict`, `non-fast-forward`. We take the single most important
collaboration tool in software and introduce it as a hazing ritual.

Git deserves the profile-page treatment.

## So that's what this site is

This profile is a git repo, and every social action on it is a git operation
wearing a fun outfit:

- **Posting** this entry was a commit (`post: ...` — it cut a release, which is
  the feed my followers subscribe to)
- **Updating my mood** is editing a JSON file
- **A friend request** is a pull request that adds one file
- **Accepting it** is merging; **rejecting** it is closing
- **Signing my wall** is a PR to a markdown file; moderation is code review
- **Unfollowing** someone is `git rm friends/them.json` — arguably healthier
  than the button ever was
- Rearranging the **Top 8** is reordering an array, and yes, the commit history
  preserves the drama forever

By the time you've made your page look right, you have cloned, committed,
pushed, branched, opened a PR, resolved a merge, and read a diff — not because
a tutorial told you to, but because you wanted your song on your page and your
friend in slot one. The repo is the profile. The workflow is the network.
The learning is the side effect, same as it ever was.

If you want in: [the template is here](https://github.com/mcowser-p/GitingSocial-Template),
setup takes two minutes, and the first thing you'll do — whether you know it or
not — is make a commit.

The kids learned HTML from glitter graphics. Maybe someone learns rebase
because of a Top 8. Stranger things have shipped.
