var path = require('path');

var sh = require('shelljs');

var utils = require('./utils');

function harp_compile(from, to) {
  var lyra_js_root = path.resolve(__dirname, '..');
  var harp_bin = path.join(lyra_js_root, "node_modules", "harp", "bin", "harp");
  var cmd = harp_bin + ' compile --output=' + to + ' ' + from;
  var err = sh.exec(cmd);
}


module.exports = {

  compile: function(from, to) {
    var tempdir = path.join(sh.tempdir(), 'lyra_compiled');
    sh.rm('-rf', tempdir);
    sh.mkdir(tempdir);
    console.log(tempdir);

    harp_compile(from, tempdir);

    utils.with_cwd(tempdir, function(cwd) {
      sh.rm('-rf', '.git'); //omg
      sh.exec('cp -r ./* ' + to);
    });
  }

};
