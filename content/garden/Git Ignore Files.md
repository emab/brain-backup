# Git Ignore Files
To ignore a tracked file (already committed): 

```bash
git update-index --skip-worktree [FILE]
```

To not ignore a tracked file: 

```bash
git update-index --no-skip-worktree FILE
```