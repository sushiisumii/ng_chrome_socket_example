'use strict';

angular.module('gdlSocketsApp')
  .service('ConnSocketio', function ConnSocketio() {

  	var self = this;

  	this.events = new EventEmitter();


  	// Socket.io connect	
  	this.serverConnect = function(startCount) {
  		console.log('serverConnect');

  		self.socketCon = io.connect('http://127.0.0.1:1337');

  		self.socketCon.on('connect', function() {
  			self.events.emit('connected');
  		});

  		self.socketCon.on('initResp', function(data) {
  			self.events.emit('initResp', { count: data.count, friends: data.friends});
  		});

  		self.socketCon.on('counter_update', function(data) {
  			self.events.emit('count', data.count);
  		});

  		self.socketCon.on('end', function() {
  			self.events.emit('disconnect');
  		})
  	};

  	// Socket.io disconnect
  	this.disconnect = function() {

  		self.socketCon.disconnect();
  		console.log("disconnected from server");
  	};

  	// Socket.io send init data to server
  	this.init = function(startCount) {
		self.socketCon.emit('init', { count: startCount});
  	}


  });
