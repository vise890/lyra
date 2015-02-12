Lyra is my take on blogging engines.

> I am not lazy. It's just a Zen thing.

None of this would have been possible without [Harp](http://harpjs.com/), of
course (hence the name lyra).


# Getting started

```bash
$ npm install -g lyra
$ mkdir ma-blog
$ cd ma-blog

# for publishing to GH pages
$ lyra init -p https://github.com/ma-username/ma-username.github.io.git

$ lyra publish
```

That's it, you now have a minimal blog setup on GH pages.

**NOTE**: the url you give to the `p` (or `publishing-url`) option can be any
git repo you can push to and that would run a webserver out of its working
copy. GH is the easiest setup.


# Testing

```bash
$ mocha
```

Or, for a quick and dirty run:

```bash
$ bin/make_test
$ cd /tmp/lyra_test
$ tree -a -L 3
.
├── blog                      # your blog root folder
│   ├── compiled              # compiled blog, it's what gets published
│   │   ├── .git              # git repo with a remote set to the path of `published`
│   │   ├── 404.html
│   │   ├── about_lyra.html
│   │   ├── index.html
│   │   └── main.css
│   └── src                   # your blog source files
│       ├── 404.jade            # page displayed when something's not found
│       ├── _layout.jade        # layout for *every* page
│       ├── about_lyra.md       # sample blog post
│       ├── index.jade          # your homepage
│       └── main.styl           # the main style
└── published                 # --bare .git repo that simulates the `publishing` remote
    ├── HEAD
    ├── config
    └── [...]
```


# Todo

- should probably abort with a helpful message when run outside of a lyra blog/repo/thing
- add support for mercurial (customer wiki)
- ftp, rsync, all the things
