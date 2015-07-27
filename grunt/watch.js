'use strict';

var grunt = require('grunt');

module.exports = {
  options: {
    dateFormat: function(time) {
      grunt.log.writeln('\n The watch finished in ' + time + 'ms at' + (new Date()).toString());
      grunt.log.writeln('\n Waiting for more changes...');
    },
  },
  dev_styles: {
    files: ['client/styles/*.css', '!client/styles/lib/**/*.css'],
    tasks: ['concat:dev_styles', 'cssmin'],
    options: {
      spawn: false,
    }
  }
};