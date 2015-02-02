/*global describe: false, it: false, before: false, after: false */
var assert = require('chai').assert;
var _ = require('lodash');

var shelljs_config = require('shelljs').config;
shelljs_config.quiet = true;
var sh = require('shelljs');

var path = require('path');

var test_setup = require('./setup');
var config = require('./test_config');

var lyra = require('../src/lyra');
var utils = require('../src/utils');

describe('lyra', function() {


  before(function() {

    test_setup.prepare(config.paths);

  });

  describe('#init()', function() {

    before(function() {
      // FIXME: capture stdout when lyra runs (quiet down test output)
      lyra.init(config);
    });

    it('copies the templates in the blog directory', function() {
      var copied_templates = sh.ls(config.paths.blog.src);
      _.forEach(test_setup.dummy_templates, function(t) {
        assert(_.includes(copied_templates, t));
      });
    });

    it('inits a git repo in the compiled blog path', function() {
      utils.with_cwd(config.paths.blog.compiled, function() {
        var command = 'git status';
        var exitcode = sh.exec(command).code;
        assert.equal(exitcode, 0,
          'git status exits normally (exitcode=0)');
      });
    });

    it('sets up a remote called publishing', function() {
      utils.with_cwd(config.paths.blog.compiled, function() {
        var command = 'git remote show';
        var output = sh.exec(command).output;
        // FIXME: this test is based on the hardcoded 'publishing' name
        // probably store in config?
        assert(_.includes(output, 'publishing'));
      });
    });
  });

  describe('#publish()', function() {

    before(function() {
      // FIXME: capture stdout when lyra runs (quiet down test output)
      lyra.publish(config);
    });

    it('compiles the blog posts into the compiled blog path', function() {
      utils.with_cwd(config.paths.blog.compiled, function() {
        var compiled_files = sh.ls();
        _.forEach(compiled_files, function(cf) {
          var content = sh.cat(cf);
          assert(_.includes(content, test_setup.dummy_content));
        });
      });
    });

    it('adds and commits the compiled blog posts in the compiled blog path', function() {

      utils.with_cwd(config.paths.blog.compiled, function() {

        var git_status = sh.exec('git status');
        assert.equal(git_status.code, 0);
        assert(_.includes(git_status.output, 'nothing to commit, working directory clean'));

      });

    });

    it('pushes the compiled posts to the publishing remote', function() {
      utils.with_cwd(config.paths.publishing_url, function() {
        var command = 'git --no-pager log';
        var output = sh.exec(command).output;
        // FIXME: this test is based on the hardcoded 'update blog' string
        assert(_.includes(output, 'update blog'));
      });
    });
  });
});
