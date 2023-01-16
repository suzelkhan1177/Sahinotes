const kue = require('kue');

const queue = kue.createQueue();
//Queue create queue but redis store the queue

module.exports = queue;
