/* @flow */

var path = require('path');
var sh = require('shelljs');

var tmp = sh.tempdir();

var test_path = path.join(tmp, 'lyra');
var lyra_root = path.resolve(__dirname, '..');

module.exports = {

  paths: {
    blog: path.join(test_path, 'blog'),

    compiled_blog: path.join(test_path, 'compiled_blog'),

    publishing_url: path.join(test_path, 'publishing_url'),

    templates: path.resolve(test_path, 'templates'),

    test_path: test_path,

    lyra_root: lyra_root,

    harp_bin: path.join(lyra_root, "node_modules", "harp", "bin", "harp")
  }

};
