var canonical_stdout_write = process.stdout.write;
module.exports = {

  silence_stdout: function() {
    process.stdout.write = function(){};
  },

  restore_stdout: function() {
    process.stdout.write = canonical_stdout_write;
  }

};
