# Git Rebase Single Commit

#git

Rebase a single commit onto another branch. Useful if you accidentally commit something to the wrong branch and don't fancy cherry-picking.

```bash
git rebase --onto master branch~1 branch 
```

This says "rebase the range of commits between last-before-branch and branch (that is, XX commit) on the tip of master branch"

After this operation branch tip is moved on commit XX, so you want to set it back with

```bash
git checkout branch
git reset --hard branch@{1}^
```

Which says "reset the branch tip to the commit before its previous state"

Source: https://stackoverflow.com/questions/14635672/rebase-a-single-git-commit
