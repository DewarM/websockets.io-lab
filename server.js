var express = require('express');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/client/build/index.html`);
});

app.use(express.static('client/build'));

var initPaint;

io.on("connection", function(socket){
  console.log("Connection!");
  socket.emit('success', socket.id);

  socket.on('clear', () => {
    if (!initPaint) return;
    initPaint = undefined;
    io.sockets.emit('clear');
  })

  if (initPaint) {
    io.sockets.emit('paint', initPaint)
  }

  socket.on("paint", (painting) => {
    initPaint = painting;
    io.sockets.emit('paint', painting);
  });

  socket.on('drawing', (id) => {
    io.sockets.emit('drawing', id);
  })

  socket.on('stopDrawing', (id) => {
    io.sockets.emit('stopDrawing', id);
  })
})


var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
