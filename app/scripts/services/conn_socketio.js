'use strict';

angular.module('gdlSocketsApp')
  .service('ConnSocketio', function ConnSocketio() {

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
  			self._events.emit('initialize', { count: data.count, friends: data.friends});
  		});

  		self.socketCon.on('counter_update', function(data) {
  			self._events.emit('count', data.count);
  		});

  		self.socketCon.on('end', function() {
  			self._events.emit('disconnect');
  		})
  	};

  	var _socketioDisconnect = function() {

  		self.socketCon.disconnect();
  		console.log("disconnected from server");

  	};


  	return { 
  	 	serverConnect: _socketioServerConnect,
  	 	disconnect: _socketioDisconnect,

  	 	events: self._events
  	};



  });
