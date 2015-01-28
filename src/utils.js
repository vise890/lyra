var shell = require('shelljs');

module.exports = {

  // FIXME: this doesn't work.
  with_cwd: function(working_dir, f) {
    var pwd = process.cwd();
    shell.cd(working_dir);

    f(working_dir);

    shell.cd(pwd);
  }

};
