'use strict';

const build = require('pino-abstract-transport')
const transformer = require('./lib/transformer');
const transporter = require('./lib/transports')

const defaultOpts = {
  customKeys: [],
  host: '127.0.0.1',
  protocol: 'amqp',
  maxChunkSize: 1420,
  keepAlive: true,
  reconnectionLimit: -1,
  reconnectionDelay: 1000,
  port: 5672,
  username: "guest",
  password: "guest",
  exchange: "logging.gelf",
  exchangeType: "fanout",
  routeKey: ""
};

module.exports = function (opts) {
  opts = Object.assign({}, defaultOpts, opts)
  const transform = transformer(opts);
  const transport = transporter(opts)

  return build(function (source) {
    source.on('data', function (data) {
      const message = transform(data)
      transport.emit('log', message);
    })
  })
}