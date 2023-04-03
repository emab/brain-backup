# Git Nice Log

```
git config --global alias.lg "log --color --graph --abbrev-commit
           --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%C(bold blue)<%an>%Creset'"
```

Use `git lg` to print a nicely colored graph version of the `git log` command.

Source: http://fredkschott.com/post/2014/02/git-log-is-so-2005/