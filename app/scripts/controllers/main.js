'use strict';

angular.module('gdlSocketsApp')
  .controller('MainCtrl', function ($scope, ConnSocketio, ConnTCPSocket) {

  	var ConnSocket = ConnSocketio;
  	// Client counter
  	$scope.count = 0;

  	$scope.friends = [];
 	
 	// Initializes connection to server.
  	ConnSocket.serverConnect();


    // Callback notifying that we have succesfully connected.
    var onConnect = function() {
    	console.log("onConnect");
    	$scope.$apply();

    	// Initialize the count to existing value.
    	ConnSocket.init($scope.count);
    };

    // Callback notifying that we have disconnected.
    var onDisconnect = function() {
    	console.log("onDisconnect");
    	$scope.$apply();
    };

    // Callback notifying that we have gotten initial data.
    var onInitialize = function(data) {
    	console.log("onInitialize");

    	$scope.count = data.count;
    	$scope.friends = data.friends;
    	$scope.$apply();
    };

    // Callback notifying that we have an updated count.
    var onCountUpdate = function(count) {
    	$scope.count = count;
    	$scope.$apply();	
    };


	// When the app is destroyed, make sure to cleanly disconnect.
  	$scope.$on('$destroy', function(event) {
  		ConnSocket.disconnect();
  	});

  	// Add listeners to events emitted by manager.
  	ConnSocket.events.addListener('disconnect', onDisconnect);
  	ConnSocket.events.addListener('connected', onConnect);
  	ConnSocket.events.addListener('initResp', onInitialize);
  	ConnSocket.events.addListener('count', onCountUpdate);
  });
