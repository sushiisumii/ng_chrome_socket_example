'use strict';

angular.module('gdlSocketsApp')
  .controller('MainCtrl', function ($scope, ConnSocket) {

  	$scope.offline = true;
  	$scope.friends = [{name: 'hi'}];
 	
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
    	var lastDate = new Date(data.lastLogin);

   		$scope.lastLogin = lastDate.getMonth() + 1 + '/' + lastDate.getDate() + '/' + lastDate.getFullYear();
    	$scope.friends = data.friends;
    	$scope.$apply();
    };


	// When the app is destroyed, make sure to cleanly disconnect.
  	$scope.$on('$destroy', function(event) {
  		ConnSocket.disconnect();
  	});


  	// Add listeners to events emitted by manager.
  	ConnSocket.events.addListener('disconnect', onDisconnect);
  	ConnSocket.events.addListener('connected', onConnect);
  	ConnSocket.events.addListener('initialize', onInitialize);
  });
