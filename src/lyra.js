#!/usr/bin/env node
/* @flow */

require('./prerequisites').check();

var sh = require('shelljs');
var colors = require('colors');

var path = require('path');

var utils = require('./utils');
var publishing = require('./publishing');

var lyra = {

  init: function(config){

    sh.echo('==> Copying templates'.green);
    sh.cp(config.paths.templates+'/*', config.paths.blog);

    sh.echo('==> Setting up local copy of compiled blog'.green);
    sh.mkdir(config.paths.compiled_blog);

    sh.echo('==> Configuring Lyra for publishing local compiled blog to remote URL'.green);
    publishing.init(config.paths.compiled_blog, config.paths.publishing_url);

    sh.echo('==> Done.'.green);
  },

  publish: function(config){
    sh.echo('==> Compiling blog pages'.green);

    // FIXME: extract this harp sheit into a module
    var command = config.paths.harp_bin+' compile --output='+config.paths.compiled_blog+' '+config.paths.blog;
    var err = sh.exec(command).code;
    if (err !== 0) {
      sh.echo('==> Could not compile blog. Aborting.'.red);
      sh.echo('Command used: '+command);
      sh.exit(1);
    }

    sh.echo('==> Pubilshing compiled blog on remote URL'.green);
    publishing.push(config.paths.compiled_blog);

    sh.echo('==> Done.'.green);
  },

  server: function(){
    console.log('==> Starting Harp server'.green);
    sh.exec('harp server');
  },

};

module.exports = lyra;

if (require.main === module) {

  var config = require('./config');

  var lyra_usage = '==> Command not recognized\n' +
    'Lyra\'s Usage:\n' +
    '$ lyra init      # init a blog in the current directory\n' +
    '$ lyra publish   # publish the blog to the provided remote\n' +
    '$ lyra server    # start a local development server\n';

  var lyra_command = process.argv[2];
  switch (lyra_command) {
    case "init":
      var argv = require('yargs')
          .describe('p', 'The url of a git repo where you want to publish your blog')
          .example('$0 -p https://github.com/vise890/vise890.github.io.git', 'Publishing on github pages')
          .alias('p', 'publishing-url')
          .demand('p')
          .argv;

      config.paths.publishing_url = argv['publishing-url'];
      lyra.init(config);
      break;
    case "publish":
      lyra.publish(config);
      break;
    case "server":
      lyra.server(config);
      break;
    default:
      sh.echo(lyra_usage);
  }

}
