'use strict';

var extend = require('node.extend');
var qs = require('querystring');

var host = 'https://slack.com/api/chat.postMessage';
var defaults = {
  'parse': 'mrkdwn',
  'link_names': 1,
  'unfurl_links': 1,
  'pretty': 1
};

function slack (data, template, config, grunt, callback) {

  if (!config.token) {
    var message = 'can\'t notify slack, no token found.';
    grunt.fail.fatal(message);
    callback(new Error(message));
  }

  var args = extend({
    'text': template(data)
  }, defaults, config);

  var slackUrl = host + '?' + qs.stringify(args);
  require('https').get(slackUrl, function(res) {
    if (res.statusCode === 200) {
      grunt.log.ok('Notified slack');
    } else {
      grunt.fail.warn('Failed to notify slack');
    }
    callback();
  }).on('error', function (e) {
    grunt.fail.fatal(e.message);
  });
}

module.exports = slack;
