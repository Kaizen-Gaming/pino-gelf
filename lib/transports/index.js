'use strict'

const Udp = require('./udp');
const Http = require('./http');
const Tcp = require('./tcp');
const Amqp = require('./amqp');

module.exports = function (opts) {

    let transport;
    switch (opts.protocol) {
        case 'udp':
            transport = new Udp(opts);
            break;
        case 'http':
        case 'https':
            transport = new Http(opts);
            break;
        case 'tcp':
        case 'tls':
            transport = new Tcp(opts);
            break;
        case "amqp":
            transport = new Amqp(opts);
            break;
    }

    return transport;
}
