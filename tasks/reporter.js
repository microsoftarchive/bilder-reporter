module.exports = function (grunt) {

  'use strict';

  var async = require('async');
  var handlebars = require('handlebars');
  var path = require('path');

  var templatesDir = path.resolve(__dirname, '../templates');

  var gitUser = require('../lib/gitUser');
  var gitCommits = require('../lib/gitCommits');
  var getLogs = require('../lib/getLogs');

  var formats = {
    'gmail': require('../lib/gmail'),
    'slack': require('../lib/slack'),
    'hipchat': require('../lib/hipchat')
  };

  grunt.registerTask('bilder/reporter', function () {

    var done = this.async();
    var options = this.options({
      'maxCommits': 3,
      'maxDeployments': 2,
      'notify': []
    });

    var logFile = path.resolve(options.logFile);
    var log = getLogs(logFile);
    var deployment = {
      'user': gitUser(),
      'environment': options.environment,
      'commits': gitCommits(options.maxCommits),
      'release': options.release,
      'date': (new Date(options.timestamp)).toString()
    };

    // keep only a few last deploy logs
    var deployments = log.deployments;
    deployments.unshift(deployment);
    log.deployments = deployments.slice(0, options.maxDeployments);

    // data for templates
    var current = deployments[0];
    var previous = deployments[1];
    var diff = previous && {
      'previous': previous.commits[0].sha1,
      'current': current.commits[0].sha1
    };

    var data = {
      'user': current.user.name,
      'environment': current.environment,
      'repoUrl': options.repoUrl,
      'changed': !!(diff && (diff.previous !== diff.current)),
      'diff': diff,
      'commits': current.commits.map(function (commit) {
        commit.repoUrl = options.repoUrl;
        return commit;
      })
    };

    // send out notifications
    var notifications = options.notify.filter(function (key) {
      return key in formats;
    });
    async.forEach(notifications, function (type, callback) {
      var template = grunt.file.read(path.join(templatesDir, type + '.tmpl'));
      var templateFn = handlebars.compile(template);
      formats[type](data, templateFn, options[type], grunt, callback);
    }, function () {
      grunt.file.write(logFile, JSON.stringify(log, null, 2));
      done();
    });
  });
};