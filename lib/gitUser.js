'use strict';

var shell = require('shelljs');

function gitUser () {
  var keys = [
    // 'email',
    'name'
  ];
  var user = {};
  keys.forEach(function (key) {
    var stdout = shell.exec('git config --get user.' + key, { silent: true});
    user[key] = stdout.output.trim();
  });
  return user;
}

module.exports = gitUser;
