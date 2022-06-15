# Git Clean Local Branches

Sometimes you end up with an absolute tonne of stale branches. This isn't a massive problem, but I personally find it
frustrating having a massive list of branches showing in my IDE Git integration.

Here are some commands that you can run that delete any local branches that do not have a remote branch - add them to
your `.zshrc` file!

```zsh
alias git-rm-dry='git fetch --prune && git branch -r | awk "{print \$1}" | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk "{print \$1}"'
alias git-rm-hot='git-rm-dry | xargs git branch -D'
```

`git-rm-dry` will do a dry run of the command, in the end displaying a list of branches that will be deleted.

`git-rm-hot` will run the command and **permanently delete** any local branches that do not track an origin branch.
Please use responsibly and **only** when all code you want to keep has been pushed upstream!

