var express = require('express');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/client/build/index.html`);
});

app.use(express.static('client/build'));

var initPaintA;
var initPaintB;

io.on("connection", function(socket){
  console.log("Connection!")
  if (initPaintA) {
    io.sockets.emit('paintA', initPaintA)
  }
  if (initPaintB) {
    io.sockets.emit('paintB', initPaintB)
  }
  socket.on("paintA", (painting) => {
    initPaintA = painting;
    io.sockets.emit('paintA', painting);
  })
  socket.on("paintB", (painting) => {
    initPaintB = painting;
    io.sockets.emit('paintB', painting);
  })
  socket.on('clear', (painting) => {
    console.log("here")--
    io.sockets.emit('clear');
  })
})


var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
