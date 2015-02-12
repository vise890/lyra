/*global describe: false, it: false, beforeEach: false, afterEach: false*/
var assert = require('chai').assert;
var _ = require('lodash');

var shelljs_config = require('shelljs').config;
shelljs_config.quiet = true;
var sh = require('shelljs');

var path = require('path');

var lyra = require('../src/lyra');
var paths = require('../src/paths');
var utils = require('../src/utils');

var test_blog = path.join(sh.tempdir(), 'test_lyra_blog');
var test_publishing = path.join(sh.tempdir(), 'test_lyra_publishing');

function cleanup() {
  sh.cd('/tmp'); // ensure we're not in a dir that doesn't exist
  sh.rm('-rf', test_blog);
  sh.rm('-rf', test_publishing);
}

describe('lyra', function() {

  describe('#init()', function() {

    beforeEach(function() {
      cleanup();
      sh.mkdir(test_blog);
      sh.cd(test_blog);
      var dummy_publishing_url = 'https://foo.org/blogus.git';
      lyra.init(paths, dummy_publishing_url);
    });

    afterEach(function() {
      cleanup();
    });

    it('copies the templates in the blog directory', function() {
      var templates = sh.ls(paths.get_templates());
      var copied_templates = sh.ls(paths.get_blog_src(test_blog));

      _.forEach(templates, function(t) {
        assert(_.includes(copied_templates, t));
      });
    });

    it('inits a git repo in the compiled blog path', function() {
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var command = 'git status';
        var exitcode = sh.exec(command).code;
        assert.equal(exitcode, 0,
                     'git status exits normally (exitcode=0)');
      });
    });

    it('sets up a remote called publishing', function() {
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var command = 'git remote show';
        var output = sh.exec(command).output;
        // FIXME: this test is based on the hardcoded 'publishing' name
        //        store in paths?
        assert(_.includes(output, 'publishing'));
      });
    });

  });

  describe('#publish()', function() {

    beforeEach(function() {
      cleanup();

      sh.mkdir(test_blog);
      sh.mkdir(test_publishing);

      sh.cd(test_blog);

      sh.exec('git init --bare ' + test_publishing);

      lyra.init(paths, test_publishing);

      lyra.publish(paths);
      // FIXME: capture stdout when lyra runs (quiet down test output)
    });

    afterEach(function() {
      cleanup();
    });

    it('compiles the blog posts into the compiled blog path', function() {
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var compiled_files = sh.ls();
        _.forEach(compiled_files, function(cf) {
          var content = sh.cat(cf);
          assert(content.length > 0);
        });
      });
    });

    it('adds and commits the compiled blog posts in the compiled blog path', function() {

      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {

        var git_status = sh.exec('git status');
        assert.equal(git_status.code, 0);
        assert(_.includes(git_status.output, 'nothing to commit, working directory clean'));

      });

    });

    it('pushes the compiled posts to the publishing remote', function() {
      utils.with_cwd(test_publishing, function() {
        var command = 'git --no-pager log';
        var output = sh.exec(command).output;
        // FIXME: this test is based on the hardcoded 'update blog' string
        assert(_.includes(output, 'update blog'));
      });
    });

  });

});
