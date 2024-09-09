'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const amqp = require('amqplib/callback_api')
const utils = require('../utils');

const rabbitMQOptions = {
    persistent: true,
    noAck: false,
    timestamp: undefined,
    contentEncoding: "utf-8",
    contentType: "text/plain"
}

const Amqp = function(opts){
    const self = this;
    self.config = _.pick(opts, ['host', 'port', 'username', 'password', 'exchange', 'exchangeType', 'routeKey'])
    self.stringify = utils.stringify(opts);

    self.on('log', (gelf) => {
        const msg = self.stringify(gelf);
        self.processMessage(msg);
    });
}

Amqp.prototype = Object.create(EventEmitter.prototype, {
    cosntructor: { value: Amqp }
});


Amqp.prototype.processMessage = function (msg) {
    if(msg == null) return;

    const self = this;
    process.nextTick(() => self.publishMessage(msg));
};

Amqp.prototype.publishMessage = function (msg) {
    const self = this;
    amqp.connect(self.constructUrl(), (error, connection) => {
        if(error) throw error;

        connection.createConfirmChannel((error, channel) => {
            if (error) throw error;
        
            rabbitMQOptions.timestamp = Date.now()
            channel.assertExchange(self.config.exchange, self.config.exchangeType);
            channel.publish(self.config.exchange, self.config.routeKey, Buffer.from(msg), rabbitMQOptions, () =>{
                channel.close()
                connection.close()
            })
        })
    })
}

Amqp.prototype.constructUrl = function () {
    const self = this;
    return `amqp://${self.config.username}:${self.config.password}@${self.config.host}:${self.config.port}`;
}

module.exports = Amqp