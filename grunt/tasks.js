'use strict';

exports.get = function(type) {
  if (type === 'server') {
    return ['clean:all', 'concat:dev_styles', 'cssmin:dev_styles', 'concurrent:watch', ];
  }
  if (type === 'deploy') {
  return ['clean:all', 'concat:dev_styles', 'cssmin:dev_styles'];
  }
};