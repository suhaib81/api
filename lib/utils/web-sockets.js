'use strict';

const socketIo = require('socket.io');
const logger = require('./logger');

module.exports = {
  registerServer
}

////

var io;

function registerServer(server) {
  if (io) {
    throw new Error('listen can be called only once')
  }
  io = socketIo.listen(server);
  logger.trace(`Socket server listening`);
  io.on('connection', socket => {

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    sendSomething();
  });
  return io;
}

// setInterval(sendSomething, 2500);
function sendSomething() {
  console.log('send something');
  io.emit('message', {'author':'Lotte', question:'Hoe moet het nouw?'});
}
