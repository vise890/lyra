var utils = require('./utils');
var sh = require('shelljs');

var __git_publishing_remote_name = 'publishing';

module.exports = {

  init: function(path, publishing_url) {
    utils.with_cwd(path, function() {

      sh.exec('git init ' + path);

      var cmd = 'git remote add ' + __git_publishing_remote_name + ' ' +
        publishing_url;

      var err = sh.exec(cmd).code;
      if (err === 128) {
        sh.echo(('--> Remote publishing already set-up. Skipping.').yellow);
      } else if (err !== 0) {
        sh.echo('==> Could not add git remote. Aborting.'.red);
        sh.echo('Command used: ' + cmd);
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
      var err = sh.exec(command).code;
      if (err !== 0) {
        // FIXME: put output after the red arrow
        sh.echo(('==> Could not push to remote `' +
          __git_publishing_remote_name + '`. Aborting.').red);

        sh.echo('Command used: ' + command);
        sh.exit(1);
      }
    });
  }

};
