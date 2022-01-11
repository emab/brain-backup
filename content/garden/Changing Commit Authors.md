
# Changing Commit Authors

#git

Two [[Git]] accounts can be annoying. Using [[Git SSH]] can help with that, but sometimes you still might forget to set your `user.name` and `user.email` to the correct details.

## One commit

```sh
git commit --amend --author="John Doe <john@doe.org>"
```

## Multiple commits

To change author for last 2 commits:

```sh
git rebase -i HEAD~2
```

Add `edit` or `e` to any commits you'd like to change the author of. Then for each commit, you can amend as before:

```sh
git commit --amend --author="John Doe <john@doe.org>" --no-edit
git rebase --continue
```