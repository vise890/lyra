var utils = require('./utils');
var sh = require('shelljs');

var publishing_remote = 'publishing';

module.exports = {

  init: function(path, publishing_url) {
    utils.with_cwd(path, function() {

      sh.exec('git init ' + path);

      var cmd = 'git remote add ' + publishing_remote + ' ' + publishing_url;
      var git_remote_add = sh.exec(cmd);
      if (git_remote_add.code === 128) {
        sh.echo(('--> Remote publishing already set-up. Skipping.').yellow);
      } else if (git_remote_add.code !== 0) {
        sh.echo('==> Could not add git remote. Aborting.'.red);
        sh.echo('Command used: ' + cmd);
        sh.exit(1);
      }
    });
  },

  push: function(compiled_blog_path) {
    utils.with_cwd(compiled_blog_path, function(cwd) {

      var cmd = 'git add ' + cwd;
      sh.echo("-> " + cmd);
      sh.exec(cmd);

      cmd = 'git commit -m "update blog"';
      sh.echo("-> " + cmd);
      sh.exec(cmd);

      cmd = 'git push ' + publishing_remote + ' master';
      sh.echo("-> " + cmd);
      var git_push = sh.exec(cmd);

      if (git_push.code !== 0) {
        var msg = '==> Could not push to remote `' +
                  publishing_remote +
                  '`. Aborting.';
        sh.echo(msg.red);
        sh.echo('Command used: ' + cmd);
        sh.exit(1);
      }
    });
  }

};
