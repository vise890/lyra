/*global describe: false, it: false, beforeEach: false, afterEach: false*/
var expect = require('chai').expect;

var path = require('path');

var sh = require('shelljs');

var paths = require('../src/paths');
var cwd = process.cwd();
describe('paths', function() {

  describe('#get_blog_root', function() {

    var blog_root = path.join(sh.tempdir(), 'lyra#get_blog_root-test');
    var blog_src = path.join(blog_root, 'src');

    beforeEach(function() {
      sh.cd(cwd);
      sh.rm('-rf', blog_root);

      sh.mkdir(blog_root);
      sh.mkdir(blog_src);
      sh.mkdir(path.join(blog_root, 'compiled'));
    });

    it('returns the passed directory if it looks like a lyra blog', function() {
      expect(paths.get_blog_root(blog_root)).to.equal(blog_root);
    });

    it('goes up until it finds a dir that looks like a lyra blog', function() {
      sh.cd(blog_src);
      expect(paths.get_blog_root(blog_root)).to.equal(blog_root);
    });

    it('errors out if no start is provided', function() {
      expect(paths.get_blog_root).to.throw(Error);
    });

    it('errors out if it cannot find a suitable lyra blog', function() {
      // TODO: 2 implement
    });

  });

  describe('#get_blog_src', function() {
    it('returns the passed path joined with `src`', function() {
      var src = path.join('/foo/bar', 'src');
      expect(paths.get_blog_src('/foo/bar')).to.equal(src);
    });
  });

  describe('#get_blog_compiled', function() {
    it('returns the passed path joined with `compiled`', function() {
      var compiled = path.join('/foo/bar', 'compiled');
      expect(paths.get_blog_compiled('/foo/bar')).to.equal(compiled);
    });
  });

});
