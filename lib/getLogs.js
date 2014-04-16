'use strict';

function getLogs (logFile) {
  var log = {};
  try {
    log = require(logFile);
  } catch (e) {}

  log.deployments = log.deployments || [];
  return log;
}

module.exports = getLogs;