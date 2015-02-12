var path = require('path');

var colors = require('colors');
var sh = require('shelljs');

var lyra_js_root = path.resolve(__dirname, '..');

var blog_src_dirname = 'src';
var blog_compiled_dirname = 'compiled';

function get_blog_root(start) {

  start = start || process.cwd();

  function is_blog_root(path) {
    var contents = sh.ls(path);

    var has_src = contents.indexOf(blog_src_dirname) !== -1;
    var has_compiled = contents.indexOf(blog_compiled_dirname) !== -1;
    var is_lyra_blog = has_src && has_compiled;

    return is_lyra_blog;
  }

  var blog_root = start;
  while (!is_blog_root(blog_root)) {
    // TODO: error out if you reach /
    blog_root = path.join(blog_root, '..');
  }

  if (!is_blog_root(blog_root)) {
    var msg = 'Cannot find blog root directory. ' +
              'It must be either an empty folder ' +
              'or one with src and compiled blog';
    sh.echo(msg.red);
    sh.exit(1);
  }

  return blog_root;
}

module.exports = {

  get_blog_root: get_blog_root,

  get_blog_src: function(blog_root) {
    return path.join(blog_root, blog_src_dirname);
  },

  get_blog_compiled: function(blog_root) {
    return path.join(blog_root, blog_compiled_dirname);
  },

  get_templates: function() {
    return path.join(lyra_js_root, 'templates');
  },

  get_harp_bin: function() {
    return path.join(lyra_js_root, "node_modules", "harp", "bin", "harp");
  }

};
