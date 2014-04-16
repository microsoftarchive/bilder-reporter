'use strict';

var mailer = require('nodemailer');

function gmail (data, template, config, grunt, callback) {

  if (!config.auth) {
    var message = 'can\'t notify gmail, no config found.';
    grunt.fail.fatal(message);
    callback(new Error(message));
  }

  var transport = mailer.createTransport('SMTP', {
    'service': 'Gmail',
    'auth': {
      'XOAuth2': config.auth
    }
  });

  var options = {
    'from': config.sender,
    'to': config.recipients,
    'subject': config.subject,
    'html': template(data)
  };

  transport.sendMail(options, function (error) {
    if (error) {
      grunt.fail.fatal(error);
    } else {
      grunt.log.ok('Notified gmail');
    }
    transport.close();
    callback();
  });
}

module.exports = gmail;
