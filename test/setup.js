require('../src/prerequisites').check();

var path = require('path');

var sh = require('shelljs');
var _ = require('lodash');

var destroy = function(path) {
  sh.rm('-rf', path);
};

var dummy_templates = ["a.txt", "b.md", "c.md"];
var dummy_content = 'Lorem ipsum whatevs';

module.exports = {


  prepare: function(paths){

    destroy(paths.test_path);

    sh.mkdir(paths.test_path,
             paths.lyra_js.templates,
             paths.blog.root,
             paths.publishing_url);

    sh.exec('git init --bare '+paths.publishing_url);

    _.forEach(dummy_templates, function(t) {
      var t_path = path.join(paths.lyra_js.templates, t);
      dummy_content.to(t_path);
    });

  },

  dummy_templates: dummy_templates,

  dummy_content: dummy_content

};
