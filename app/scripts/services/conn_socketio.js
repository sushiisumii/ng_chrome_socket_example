'use strict';

angular.module('gdlSocketsApp')
  .service('ConnSocket', function ConnSocket() {

  	var self = this;

  	self._events = new EventEmitter();


  	/*
  	 * Socket.io Connection
  	 */
  	var _socketioServerConnect = function() {

  		self.socketCon = io.connect('http://127.0.0.1:1337');

  		self.socketCon.on('connect', function() {
  			self._events.emit('connected');
  		});

  		self.socketCon.on('initialize', function(data) {
  			self._events.emit('initialize', { lastLogin : data.lastLogin, friends: data.friends});
  		});

  		self.socketCon.on('end', function() {
  			self._events.emit('disconnect');
  		})
  	};

  	var _socketioDisconnect = function() {

  		self.socketCon.disconnect();
  		console.log("disconnected from server");

  	};



  	var socketInfo;

  	var _tcpReadData = function(readInfo) {
  		if(readInfo.resultCode <= 0) {
  			console.log("invalid result code", readInfo.resultCode);
  			chrome.socket.read(socketInfo.socketId, null, _tcpReadData);
  			return;
  		}

  		//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  		console.log(JSON.parse(ab2str(readInfo.data)));
  		var dataObj = JSON.parse(ab2str(readInfo.data));
  		self._events.emit('initialize', { lastLogin: dataObj.lastLogin, friends: dataObj.friends});

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
  	 	// serverConnect: _socketioServerConnect,
  	 	// disconnect: _socketioDisconnect,

  	 	serverConnect: _tcpServerConnect,
  	 	disconnect: _tcpDisconnect,

  	 	events: self._events
  	};



  });
