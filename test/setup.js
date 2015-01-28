/* @flow */
require('../src/prerequisites').check();

var sh = require('shelljs');

module.exports = {

  setup: function(paths){
    sh.mkdir(paths.test_path,
             paths.blog,
             paths.templates,
             paths.publishing_url);

    sh.exec('git init --bare '+paths.publishing_url);
  },

  tear_down: function(paths) {
    sh.rm('-rf', paths.test_path);
  },

};

