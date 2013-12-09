function handler (req, res) {
  res.writeHead(200);
  res.end('Server');
}


console.log('Socket.io running on port 1337');


// Some data to respond with.
var counter = 0;
var friendsList = [{name: 'Bill'},{ name: 'Steve'}, { name: 'Woz'} ];

/*
 * Socket.io connection
 */

var io_server = require('http').createServer(handler);
var io = require('socket.io').listen(io_server);
io.sockets.on('connection', function(socket){

   socket.on('init', function(data) {
        counter = data.count;

        socket.emit('initResp', { count: counter, friends: friendsList });
   });

   socket.on('disconnect', function() {
        clearInterval(writerLoop);
        counter = 0;
   });


   var writerLoop = setInterval(function() {
        counter++;
        socket.emit('counter_update', { count: counter} );
   }, 1000);
});

io_server.listen(1337, '127.0.0.1');



/*
 * TCP connection
 */
var net = require('net');
var tcp_server = net.createServer(function (sock) {

  var writerLoop;

  sock.on('end', function() {
    clearInterval(writerLoop);
    counter = 0;
  });

  sock.on('data', function(data) {
    var dataObj = JSON.parse(data);
    console.log(dataObj);
    if(dataObj.event === 'init') {
        counter = dataObj.data.count;

        sock.write(JSON.stringify({ 'event': 'initResp', data: {count: counter, friends: friendsList }}));
        
        writerLoop = setInterval(function() {
              counter++;
              sock.write(JSON.stringify({ 'event': 'counter_update', data: { count: counter}} ));
        }, 1000);
    }
  });

});

tcp_server.listen(1338, function() { 
  console.log('TCP running on port 1338');
});

