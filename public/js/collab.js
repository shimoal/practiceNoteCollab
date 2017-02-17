var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, socket) {
  $scope.notes = [];

  socket.on('onNoteCreated', function(data) {
    $scope.notes.push(data);
  });

  $scope.createNote = function() {
    var note = {
      id: new Date().getTime(),
      title: 'New Note',
      body: 'Pending'
    };

    $scope.notes.push(note);
    socket.emit('createNote', note);
  };

  socket.on('onNoteDeleted', function(data) {
    $scope.deleteNote(data.id);
  });

  $scope.deleteNote = function(id) {
    var oldNotes = $scope.notes;
    newNotes = [];

    angular.forEach(oldNotes, function(note) {
      if (note.id !== id) newNotes.push(note);
    });

    $scope.notes = newNotes;

    socket.emit('deleteNote', {id: id});
  };


});

app.factory('socket', function($rootScope) {
  var socket = io.connect();


  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };

});

app.directive('stickyNote', function(socket) {
  var linker = function(scope, element, attrs) {
    element.css('left', '10px');
    element.css('top', '50px');
  };

  var controller = function($scope) {

    socket.on('onNoteUpdate', function(data){
      if (data.id === $scope.note.id) {
        $scope.note.title = data.title;
        $scope.note.body = data.body;
      }
    });


    $scope.deleteNote = function(id) {
      $scope.ondelete({
        id: id
      });
    };

    $scope.updateNote = function(note) {
      socket.emit('updateNote', note);
    };

  };

  return {
    restrict: 'A',
    link: linker,
    controller: controller,
    scope: {
      note: '=',
      ondelete: '&'
    }
  };

});