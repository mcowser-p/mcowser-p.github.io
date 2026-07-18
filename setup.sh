#!/usr/bin/env bash
# Publish this folder to GitHub as your network's template repo.
# Requires: GitHub CLI (`gh`) logged in — check with `gh auth status`.
# Usage: ./setup.sh [repo-name]     (default: gitsocial-template)
set -euo pipefail

NAME="${1:-gitingsocial-template}"
ME="$(gh api user -q .login)"
FULL="$ME/$NAME"

git init -b main >/dev/null 2>&1 || true
git add -A
git commit -m "feat: GitingSocial template" >/dev/null 2>&1 || echo "(nothing new to commit)"

if gh repo view "$FULL" >/dev/null 2>&1; then
  echo "Repo $FULL exists — pushing to it."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$FULL.git"
  git push -u origin main
else
  gh repo create "$FULL" --public --source . --push
fi

# Mark as a template so people get the "Use this template" button.
gh repo edit "$FULL" --template=true 2>/dev/null \
  || gh api -X PATCH "repos/$FULL" -F is_template=true >/dev/null

echo
echo "Template ready: https://github.com/$FULL"
echo "Participants join with:  ./join.sh $FULL   (script in the folder above this one)"
