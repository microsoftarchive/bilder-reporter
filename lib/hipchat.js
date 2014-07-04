'use strict';

var https = require('https');
var extend = require('node.extend');

var defaults = {
  'color': 'green',
  'notify': true,
  'message_format': 'text'
};

function hipchat (data, template, config, grunt, callback) {

  if (!config.token) {
    var message = 'can\'t notify hipchat, no token found.';
    grunt.fail.fatal(message);
    callback(new Error(message));
  }

  var request = https.request({
    'method': 'POST',
    'host': 'api.hipchat.com',
    'path': '/v2/room/' + config.channel + '/notification',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.token
    }
  }, function (response) {
    if (response.statusCode === 200) {
      grunt.log.ok('Notified hipchat');
    } else {
      grunt.fail.warn('Failed to notify hipchat');
    }
    callback();
  });
  request.on('error', function (e) {
    grunt.fail.fatal(e.message);
  });

  var args = extend({ 'message': template(data)}, defaults);
  request.write(JSON.stringify(args));
  request.end();
}

module.exports = hipchat;
