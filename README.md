Lyra is my take on blogging engines.

> I am not lazy. It's just a Zen thing.

None of this would have been possible without [Harp](http://harpjs.com/), of
course (hence the name lyra).

# Installing

```bash
$ npm install -g lyra
$ mkdir ma-blog
$ cd ma-blog
$ lyra init -p https://github.com/ma-username/ma-username.github.io.git # for publishing to GH pages
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
$ scripts/make_test
$ cd /tmp/lyra
$ tree
.
├── blog                # the blog folder, with templates copied
│   ├── 404.jade
│   ├── _layout.jade
│   ├── about_lyra.md
│   ├── index.jade
│   └── main.styl
├── clear_test          # script, in case you wanna nuke the folders
└── published           # bare git repo, with the up to date, compiled blog pushed to it
    ├── HEAD
    ├── config
    ├── description
    ├── hooks
    ├── info
    ├── objects
    └── refsk
```

# Todo

- add support for mercurial (customer wiki)
- ftp, rsync, all the things

