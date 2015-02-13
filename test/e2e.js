/*global describe: false, it: false, beforeEach: false, afterEach: false*/
var assert = require('chai').assert;
var _ = require('lodash');

var shelljs_config = require('shelljs').config;
shelljs_config.quiet = true;
var sh = require('shelljs');

var path = require('path');

var test_utils = require('./test_utils');

var lyra = require('../src/lyra');
var paths = require('../src/paths');
var utils = require('../src/utils');

var test_blog = path.join(sh.tempdir(), 'test_lyra_blog');
var test_publishing = path.join(sh.tempdir(), 'test_lyra_publishing');

function cleanup() {
  sh.cd('/tmp'); // ensure we're in a dir that does exist
  sh.rm('-rf', test_blog);
  sh.rm('-rf', test_publishing);
}

describe('lyra', function() {

  describe('#init()', function() {

    beforeEach(function() {
      cleanup();
      test_utils.silence_stdout();
      sh.mkdir(test_blog);
      sh.cd(test_blog);
      var dummy_publishing_url = 'https://foo.org/blogus.git';
      lyra.init(dummy_publishing_url);
      test_utils.restore_stdout();
    });

    afterEach(function() {
      cleanup();
    });

    it('copies the templates in the blog directory', function() {
      var templates = sh.ls(paths.get_templates());
      var copied_templates = sh.ls(paths.get_blog_src(test_blog));

      _.forEach(templates, function(t) {
        assert(_.includes(copied_templates, t), 'Template '+t+' was copied');
      });
    });

    it('inits a git repo in the compiled blog path', function() {
      test_utils.silence_stdout();
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var cmd = 'git status';
        var exitcode = sh.exec(cmd).code;
        assert.equal(exitcode, 0, 'git status exits normally (exitcode=0)');
      });
      test_utils.restore_stdout();
    });

    it('sets up a remote called publishing', function() {
      test_utils.silence_stdout();
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var cmd = 'git remote show';
        var output = sh.exec(cmd).output;
        assert(_.includes(output, 'publishing'), 'the publishing remote was added');
      });
      test_utils.restore_stdout();
    });

  });

  describe('#publish()', function() {

    beforeEach(function() {
      this.timeout(4000); // .. harp is really slow
      cleanup();

      test_utils.silence_stdout();
      sh.mkdir(test_blog);
      sh.mkdir(test_publishing);

      sh.cd(test_blog);

      sh.exec('git init --bare ' + test_publishing);
      lyra.init(test_publishing);
      lyra.publish();
      test_utils.restore_stdout();
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

    it('adds and commits everything in the compiled blog path', function() {
      test_utils.silence_stdout();
      utils.with_cwd(paths.get_blog_compiled(test_blog), function() {
        var git_status = sh.exec('git status');
        assert.equal(git_status.code, 0);
        var wd_clean = _.includes(git_status.output, 'nothing to commit, working directory clean');
        assert(wd_clean, 'the working directory is clean');
      });
      test_utils.restore_stdout();
    });

    it('pushes the compiled posts to the publishing remote', function() {
      test_utils.silence_stdout();
      utils.with_cwd(test_publishing, function() {
        var cmd = 'git --no-pager log';
        var output = sh.exec(cmd).output;
        // FIXME: this test is based on the hardcoded 'update blog' string
        var log_has_commit = _.includes(output, 'update blog');
        assert(log_has_commit, "git log contains the pushed commit");
      });
      test_utils.restore_stdout();
    });

  });

});
