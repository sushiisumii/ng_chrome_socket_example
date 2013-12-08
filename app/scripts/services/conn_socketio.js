'use strict';

angular.module('gdlSocketsApp')
  .service('ConnSocketio', function ConnSocketio() {

  	var self = this;

  	self._events = new EventEmitter();

  	var _serverConnect = function() {

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

  	var _disconnect = function() {
  		console.log("disconnected from server");

  	};


  	return { 
  	 	serverConnect: _serverConnect,
  	 	disconnect: _disconnect,

  	 	events: self._events
  	};


  });
