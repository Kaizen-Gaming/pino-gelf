const utils = require('./../utils');

module.exports = function (data) {

  let mandatoryPayload = {
    version: '1.1',
    host: '0.0.0.0',
    short_message: '[empty message]',
  };

  let payload = {};

  if (typeof data.hostname === 'string') {
    payload.host = data.hostname;
  }

  if (typeof data.msg === 'string') {
    // msg is a string
    payload.short_message = data.msg.substring(0, 65);
    payload.full_message = data.msg;
  } else if (typeof data.msg !== 'undefined') {
    // msg is something else
    payload.full_message = JSON.stringify(data.msg);
  }

  if (typeof data.time === 'number') {
    payload.timestamp = data.time / 1000;
  }

  if (typeof data.level === 'number') {
    payload.level = utils.pinoLevelToSyslogLevel(data.level);
  }

  if (typeof data.facility === 'string'){
    payload.facility = data.facility
  }

  if(typeof data.logger_name === 'string'){
    payload.logger_name = data.logger_name
  }

  // Add all additional fields as underscore prefixed string values
  for (let [key, value] of Object.entries(data)) {
    if (!['hostname', 'msg', 'time', 'level', 'pid', 'v', 'facility', 'logger_name'].includes(key)) {
      payload[`_${key}`] = typeof value === 'string' ? value : JSON.stringify(value);
    }
  }

  return Object.assign({}, mandatoryPayload, payload);
};
