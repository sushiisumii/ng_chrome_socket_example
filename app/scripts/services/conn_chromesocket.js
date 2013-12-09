'use strict';

angular.module('gdlSocketsApp')
  .service('ConnTCPSocket', function ConnTCPSocket() {

  	var self = this;

  	this.events = new EventEmitter();


	var socketInfo;

	// TCP read loop
  	var _tcpReadData = function(readInfo) {
  		// Invalid read, error or disconnect happened.
  		if(readInfo.resultCode <= 0) {
  			self.disconnect();
  			self.events.emit('disconnect');

  			if(readInfo.resultCode == 0)
  				startReconnect();
  			return;
  		}

  		// Convert from ArrayBuffer to JSON
  		var rawObj = JSON.parse(ab2str(readInfo.data));

  		var readEvent = rawObj.event;
  		var dataObj = rawObj.data;

  		if(readEvent === 'initResp') {
  			self.events.emit('initResp', { count: dataObj.count, friends: dataObj.friends});
  		}
  		else if (readEvent === 'counter_update') {
  			self.events.emit('count', dataObj.count);	
  		}

  		// Re-read on the socket.
  		chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
  	};

  	// TCP server connect
  	this.serverConnect = function() {
  		console.log('serverConnect');

  		// Create TCP connection
  		chrome.socket.create('tcp', function(createInfo) {
  			socketInfo = createInfo;

  			// Connect to the server
  			chrome.socket.connect(socketInfo.socketId, '127.0.0.1', 1338, function(result) {
  				// Successful connect
    			if(result === 0) {
    				// Incase we weren't connected before, disconnect.
    				stopReconnect();
  					self.events.emit('connected');
  				}
  			});
  		});
  	};

  	// TCP disconnect
  	this.disconnect = function() {
  		chrome.socket.disconnect(socketInfo.socketId);
  		chrome.socket.destroy(socketInfo.socketId);
	};

	// TCP send init data to server
  	this.init = function(startCount) {
  		// Convert JSON to ArrayBuffer
  		var objString = JSON.stringify({event: 'init', data: { count: startCount }});

  		// Write data out on socket.
		chrome.socket.write(socketInfo.socketId, str2ab(objString),
			function(writeInfo) {
				// Make sure we're waiting for data from the server.
		  		chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
			});
  	};


    // Reconnect logic.
	var reconnectLoop;

    var startReconnect = function() {
    	reconnectLoop = setInterval(function() {
		  	self.serverConnect();
    	}, 10 * 1000);
    };

    var stopReconnect = function() {
    	if(!!reconnectLoop) {
    		clearInterval(reconnectLoop);
    		reconnectLoop = null;
    	}
    };

	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  	var ab2str = function(buf) {
       return String.fromCharCode.apply(null, new Uint8Array(buf));
    };

    var str2ab = function(str) {
       var buf = new ArrayBuffer(str.length); 
       var bufView = new Uint8Array(buf);
       for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
       }
       return buf;
     };


  });
