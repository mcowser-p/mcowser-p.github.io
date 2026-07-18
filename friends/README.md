# friends/

One friend per file. Each file follows one GitingSocial site.

- **Filename:** `<their-github-username>.json` (only used for uniqueness — content is what counts)
- **Content:** `{ "repo": "owner/repo" }` pointing at their profile repo

To follow someone, add a file here and commit (`chore: follow owner/repo`).
To send a **friend request**, open a PR that adds a file like this to *their* repo's
`friends/` folder, containing *your* repo. One file per friend means friend
requests never merge-conflict.

This README is ignored by the build.
