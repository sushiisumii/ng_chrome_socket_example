'use strict';

angular.module('gdlSocketsApp')
  .service('ConnTCPSocket', function ConnTCPSocket() {

  	var self = this;

  	self._events = new EventEmitter();


	var socketInfo;

  	var _tcpReadData = function(readInfo) {
  		if(readInfo.resultCode <= 0) {
  			console.log("invalid result code", readInfo.resultCode);
  			chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
  			return;
  		}

  		var rawObj = JSON.parse(ab2str(readInfo.data));
  		console.log(rawObj);

  		var readEvent = rawObj.event;
  		var dataObj = rawObj.data;

  		if(readEvent === 'initialize') {
  			self._events.emit('initialize', { count: dataObj.count, friends: dataObj.friends});
  		}
  		else if (readEvent === 'counter_update') {
  			self._events.emit('count', dataObj.count);	
  		}

  		chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
  	};

  	/*
  	 * TCP Connection
  	 */
  	var _tcpServerConnect = function() {

  		chrome.socket.create('tcp', function(createInfo) {
  			socketInfo = createInfo;

  			chrome.socket.connect(socketInfo.socketId, '127.0.0.1', 1338, function(result) {
  				self._events.emit('connected');
  				chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
  			});
  		});
  	};

  	var _tcpDisconnect = function() {
  		chrome.socket.disconnect(socketInfo.socketId);
  		console.log("disconnected from server");
	};


	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  	var ab2str = function(buf) {
       return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    var str2ab = function(str) {
       var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
       var bufView = new Uint8Array(buf);
       for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
       }
       return buf;
     }



  	return { 
  	 	serverConnect: _tcpServerConnect,
  	 	disconnect: _tcpDisconnect,

  	 	events: self._events
  	};

  });
