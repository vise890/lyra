var shell = require('shelljs');

module.exports = {

  with_cwd: function(working_dir, f) {
    var pwd = process.cwd();
    shell.cd(working_dir);

    f(working_dir);

    shell.cd(pwd);
  }

};
