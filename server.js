function handler (req, res) {
  res.writeHead(200);
  res.end('Server');
}


var server = require('http').createServer(handler);
server.listen(1337, '127.0.0.1');

console.log('Server running on port 1337');


// Some data to respond with.
var counter = 0;
var friendsList = [{name: 'Bill'},{ name: 'Steve'}, { name: 'Woz'} ];


/*
 * Socket.io connection
 */

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){

   socket.emit('initialize', { count: counter, friends: friendsList });

   socket.on('disconnect', function() {
        clearInterval(writerLoop);
        counter = 0;
   });


   var writerLoop = setInterval(function() {
        counter++;
        socket.emit('counter_update', { count: counter} );
   }, 1000);
});



/*
 * TCP connection
 */
var net = require('net');
var tcp_server = net.createServer(function (sock) {

  sock.write(JSON.stringify({ 'event': 'initialize', data: {count: counter, friends: friendsList }}));

  sock.on('data', function(data) {

  });

  sock.on('end', function() {
    clearInterval(writerLoop);
    counter = 0;
  });


  var writerLoop = setInterval(function() {
        counter++;
        sock.write(JSON.stringify({ 'event': 'counter_update', data: { count: counter}} ));
  }, 1000);
  
});

tcp_server.listen(1338, function() { 
  console.log('tcp server running');
});

