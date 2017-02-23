//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService'])

  .controller('userController', function($routeParams, User) {

    var vm = this;

    /*Pour des raisons pratiques nous allons séparer la logique de l'inscription de la logique gloable lié à l'utilisateur sinon dans
    la console on va nous renvoyer un message d'erreur 403*/

    User.all()
      .then(function(data) {

        //On va stocké nos utilisateurs dans la variable vm.users
        vm.users = data.data;

      });

    User.get($routeParams.user_id)
      .then(function(data) {

        vm.user = data.data;

      });


  })

  .controller('userEditController', function($routeParams, User) {

    var vm = this;

    //On récupère un utlisateur unique grâce à son Id

    User.get($routeParams.user_id)
      .then(function(data) {

        vm.userData = data.data;

      });


      vm.saveUser = function() {

        User.update($routeParams.user_id, vm.userData)
          .then(function(data) {

            vm.userData = {};

          });
      };
  });
