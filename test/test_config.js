var path = require('path');
var sh = require('shelljs');

var tmp = sh.tempdir();

var test_path = path.join(tmp, 'lyra');
var lyra_js_root = path.resolve(__dirname, '..');

module.exports = {

  paths: {

    blog: {
      root: path.join(test_path, 'blog'),
      src: path.join(test_path, 'blog', 'src'),
      compiled: path.join(test_path, 'blog', 'compiled')
    },

    publishing_url: path.join(test_path, 'publishing_url'),

    lyra_js: {

      root: lyra_js_root,
      templates: path.resolve(test_path, 'templates'),
    },

    harp_bin: path.join(lyra_js_root, "node_modules", "harp", "bin", "harp"),

    test_path: test_path
  }

};
