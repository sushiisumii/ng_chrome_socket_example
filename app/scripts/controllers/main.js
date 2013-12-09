'use strict';

angular.module('gdlSocketsApp')
  .controller('MainCtrl', function ($scope, ConnSocketio, ConnTCPSocket) {

  	var ConnSocket = ConnTCPSocket;

  	$scope.offline = true;
  	$scope.friends = [];
 	
 	// Initializes connection to server.
  	ConnSocket.serverConnect();


    // Callback notifiying that we have succesfully connected.
    var onConnect = function() {
    	console.log("onConnect");
    	$scope.offline = false;
    	$scope.$apply();
    };

    // Callback notifiying that we have disconnected.
    var onDisconnect = function() {
    	console.log("onDisconnect");
    	$scope.offline = true;
    	$scope.$apply();
    };

    // Callback notifiying that we have gotten initial data.
    var onInitialize = function(data) {
    	console.log("onInitialize");

    	$scope.count = data.count;
    	$scope.friends = data.friends;
    	$scope.$apply();
    };

    var onCountUpdate = function(count) {
    	$scope.count = count;
    	$scope.$apply();	
    }


	// When the app is destroyed, make sure to cleanly disconnect.
  	$scope.$on('$destroy', function(event) {
  		ConnSocket.disconnect();
  	});


  	// Add listeners to events emitted by manager.
  	ConnSocket.events.addListener('disconnect', onDisconnect);
  	ConnSocket.events.addListener('connected', onConnect);
  	ConnSocket.events.addListener('initialize', onInitialize);
  	ConnSocket.events.addListener('count', onCountUpdate);
  });
