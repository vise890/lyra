var sh = require('shelljs');
var colors = require('colors');

var utils = require('./utils');
var publishing = require('./publishing');

module.exports = {

  init: function(paths, publishing_url) {

    var blog_root = process.cwd();
    var src = paths.get_blog_src(blog_root);
    var compiled = paths.get_blog_compiled(blog_root);

    sh.mkdir(src);
    sh.mkdir(compiled);

    sh.echo('==> Copying templates'.green);
    sh.cp(paths.get_templates() + '/*', src);

    var msg = '==> Configuring Lyra for publishing to remote URL';
    sh.echo(msg.green);
    publishing.init(compiled, publishing_url);

    sh.echo('==> Done.'.green);
  },

  publish: function(paths) {

    var blog_root = paths.get_blog_root();
    var src = paths.get_blog_src(blog_root);
    var compiled = paths.get_blog_compiled(blog_root);

    sh.echo('==> Compiling blog pages'.green);

    // FIXME: extract this harp sheit into a module
    var cmd = paths.get_harp_bin() + ' compile --output=' + compiled + ' ' + src;
    var err = sh.exec(cmd).code;
    if (err !== 0) {
      sh.echo('==> Could not compile blog. Aborting.'.red);
      sh.echo('Command used: ' + cmd);
      sh.exit(1);
    }

    sh.echo('==> Publishing blog on remote URL'.green);
    publishing.push(compiled);

    sh.echo('==> Done.'.green);
  },

  server: function() {
    sh.echo('==> Starting local server'.green);
    sh.exec('harp server');
  },

};
