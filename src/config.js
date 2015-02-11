var path = require('path');
var fs = require('fs');

var colors = require('colors');
var sh = require('shelljs');

var lyra_js_root = path.resolve(__dirname, '..');

var blog_src_dirname = 'src';
var blog_compiled_dirname = 'compiled';

function is_blog_root(path) {
  var contents = fs.readdirSync(path);
  return (contents.length === 0 ||
          ((contents.indexOf(blog_src_dirname) !== -1) &&
           (contents.indexOf(blog_compiled_dirname) !== -1)));
}

var cwd = process.cwd();
var blog_root;
if (is_blog_root(cwd)) {
  blog_root = cwd;
} else {
  blog_root = path.join(cwd, '..');
  if (!is_blog_root(blog_root)) {
    sh.echo('Cannot find blog root directory. It must be either an empty folder or one with src and copiled blog'.red);
    sh.exit(1);
  }
}

module.exports = {

  paths: {

    blog: {
      root: blog_root,
      src: path.join(blog_root, blog_src_dirname),
      compiled: path.join(blog_root, blog_compiled_dirname)
    },

    lyra_js: {
      root: lyra_js_root,
      templates: path.join(lyra_js_root, 'templates'),
    },

    harp_bin: path.join(lyra_js_root, "node_modules", "harp", "bin", "harp")
  }

};
