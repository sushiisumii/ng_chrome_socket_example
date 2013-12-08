'use strict';

angular.module('gdlSocketsApp')
  .controller('MainCtrl', function ($scope, ConnSocketio) {

  	$scope.offline = true;
  	$scope.friends = [{name: 'hi'}];
 	
 	// Initializes connection to server.
  	ConnSocketio.serverConnect();


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
  		ConnSocketio.disconnect();
  	});


  	// Add listeners to events emitted by manager.
  	ConnSocketio.events.addListener('disconnect', onDisconnect);
  	ConnSocketio.events.addListener('connected', onConnect);
  	ConnSocketio.events.addListener('initialize', onInitialize);
  });
