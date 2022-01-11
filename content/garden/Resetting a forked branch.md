# Resetting a forked branch
#git 

Forked a branch and finished merging and want yours to look like the original branch? Look no further!

```sh
git remote add upstream /url/to/original/repo
git fetch upstream
git checkout master
git reset --hard upstream/master  
git push origin master --force 
```

If you want to preserve your commits:

```sh
git remote add upstream /url/to/original/repo
git fetch upstream
git checkout master
git rebase upstream/master  
git push origin master --force
```
