'use strict';

var shell = require('shelljs');

function gitCommits (count) {
  var cmd = 'git log --oneline -' + count;
  var stdout = shell.exec(cmd, { 'silent': true });
  var lines = stdout.output.trim().split(/[\r\n]/);
  return lines.map(function (line) {
    var sha1 = line.split(' ').shift();
    var message = line.substr(sha1.length + 1).trim();
    return {
      'sha1': sha1,
      'message': message
    };
  });
}

module.exports = gitCommits;