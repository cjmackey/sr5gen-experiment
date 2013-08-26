var npid = require('npid');

npid.create('./logs/server/server.pid');


var io = require('socket.io').listen(8081);

/*
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
*/
io.set('transports', ['websocket']);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
