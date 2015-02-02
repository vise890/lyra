var utils = require('./utils');
var sh = require('shelljs');

var __git_publishing_remote_name = 'publishing';

module.exports = {

  init: function(path, publishing_url) {
    utils.with_cwd(path, function() {

      sh.exec('git init ' + path);

      var cmd = 'git remote add ' + __git_publishing_remote_name + ' ' +
        publishing_url;

      var git_remote_add = sh.exec(cmd);
      if (git_remote_add.code === 128) {
        sh.echo(('--> Remote publishing already set-up. Skipping.').yellow);
      } else if (git_remote_add.code !== 0) {
        sh.echo('==> Could not add git remote. Aborting.'.red);
        sh.echo('Command used: ' + cmd);
        sh.echo('Command output: ' + git_remote_add.output);
        sh.exit(1);
      }

    });
  },

  push: function(compiled_blog_path) {
    utils.with_cwd(compiled_blog_path, function(cwd) {

      var command = 'git add ' + cwd;
      sh.echo("-> " + command);
      sh.exec(command);

      command = 'git commit -m "update blog"';
      sh.echo("-> " + command);
      sh.exec(command);

      command = 'git push ' + __git_publishing_remote_name + ' master';
      sh.echo("-> " + command);
      var git_push = sh.exec(command);

      if (git_push.code !== 0) {
        sh.echo(('==> Could not push to remote `' +
                 __git_publishing_remote_name + '`. Aborting.').red);
        sh.echo('Command used: ' + command);
        sh.echo('Command output: ' + command.output);
        sh.exit(1);
      }

    });
  }

};
