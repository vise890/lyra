Lyra is my take on blogging engines.

> I am not lazy. It's just a Zen thing.

None of this would have been possible without [Harp](http://harpjs.com/), of
course (hence the name lyra).

# Pseudocode

<<<<<<< HEAD
```
- lyra init --publish-to=https://github.com/lyra/is_awesome
  - $published = @--publish-to
=======
```batch
- lyra init
>>>>>>> 0.1
  - cp ./templates/* ./
  - ask for $publishing-remote-url
  - git init ./.compiled
  - with cwd=./.compiled
    - git remote add publishing $publishing-remote-url
    - touch .delete_me
    - git add .
    - git commit -m "initial commit"
    - git push --set-upstream $publishing-remote-url master
- lyra publish
  - harp compile .compiled ./
  - with cwd=./.compiled
    - git add .
    - git commit -m "update blog"
    - git push
- lyra server
  - harp server
```


