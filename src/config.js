var path = require('path');

var lyra_root = path.resolve(__dirname, '..');
module.exports = {

  paths: {
    blog: process.cwd(),

    compiled_blog: path.resolve(process.cwd(), '.compiled'),

    templates: path.join(lyra_root, 'templates'),

    lyra_root: lyra_root,

    harp_bin: path.join(lyra_root, "node_modules", "harp", "bin", "harp")
  }

};
