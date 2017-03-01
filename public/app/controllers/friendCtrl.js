angular.module('friendCtrl', ['userService'])

  .controller('friendController', function($routeParams, User) {

    var vm = this;

    User.get($routeParams.user_id)
      .then(function(data) {

      });

    vm.type = 'friends';

    /*/L'objectif de cette fonction est de permettre d'afficher dans la vue seulement les profils utilisateur dont le status d'amis est
    confirmé/*/

    vm.checkFriends = function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'friends';
      //On va récupérer tous nos utilisateurs via notre API
      User.all()
        .then(function(data) {
          vm.users = data.data;

        });
    };

    /*/L'objectif de cette fonction est de permettre d'afficher dans la vue seulement les profils utilisateur dont le status d'amis est
    en attente/*/

    vm.checkRequests = function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'requests';
      //On va récupérer tous nos utilisateurs via notre API
      User.all()
        .then(function(data) {
          vm.users = data.data;

        });
    };

    /*/L'objectif de cette fonction est d'afficher dans la vue tous les utilisateurs qui ne sont pas encore amis avec l'utilisateurs/*/

    vm.findFriends = function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'find';
      //On va récupérer tous nos utilisateurs via notre API
      User.all()
        .then(function(data) {
          vm.users = data.data;
    
        });
    };

  });
