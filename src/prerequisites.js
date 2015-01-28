var sh = require('shelljs');
var colors = require('colors');

module.exports = {
  check: function() {
    if (!sh.which('git')) {
      sh.echo('==> Sorry, Lyra needs git to run (for now)'.red);
      sh.exit(1);
    }
  }
};
