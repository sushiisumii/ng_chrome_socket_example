'use strict';

angular.module('gdlSocketsApp')
  .service('ConnSocketio', function ConnSocketio() {

  	var self = this;

  	this.events = new EventEmitter();


  	// Socket.io connect	
  	this.serverConnect = function() {

  		// Connect to Socket.io server
  		self.socketCon = io.connect('http://127.0.0.1:1337');

  		// Connection to Server made
  		self.socketCon.on('connect', function() {
  			self.events.emit('connected');
  		});

  		// Server initialized data
  		self.socketCon.on('initResp', function(data) {
  			self.events.emit('initResp', { count: data.count, friends: data.friends});
  		});

  		// Update Counter
  		self.socketCon.on('counter_update', function(data) {
  			self.events.emit('count', data.count);
  		});

  		// Disconnected
  		self.socketCon.on('end', function() {
  			self.events.emit('disconnect');
  		});
  		self.socketCon.on('error', function() {
  			self.events.emit('disconnect');
  		})
  		self.socketCon.on('reconnecting', function() {
  			self.events.emit('disconnect');
  		})
  	};

  	// Socket.io disconnect
  	this.disconnect = function() {
  		self.socketCon.disconnect();
  	};

  	// Socket.io send init data to server
  	this.init = function(startCount) {
		self.socketCon.emit('init', { count: startCount});
  	};


  });
