var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function(socket) {
  socket.on('createNote', function(data) {
    socket.broadcast.emit('onNoteCreated', data);
  });

  socket.on('updateNote', function(data) {
    socket.broadcast.emit('onNoteUpdated', data);
  });

  socket.on('deleteNote', function(data) {
    socket.broadcast.emit('onNoteDeleted', data);
  });

  socket.on('moveNote', function(data) {
    socket.broadcast.emit('onNoteMoved', data);
  });
});


server.listen(port, function() {
  console.log('listening on port ' + port);
});