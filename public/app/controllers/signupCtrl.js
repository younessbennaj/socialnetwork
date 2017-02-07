//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('signupCtrl', ['userService'])

  .controller('signupController', function(User) {

    var vm = this;

    vm.saveUser = function() {

      //On va clearer notre message
      vm.message = '';

      //On va faire appelle à la fonction create() de notre service User qui va nous permettre de créer un nouvel utilisateur
      //Cette fonction va prendre ne argument l'objet qui contient les différentes informations de notre utilisateur nécessaire à sa création
      User.create(vm.userData)
        .then(function(data) {

          //On va clearer le formulaire d'inscription
          vm.userData = {};

          vm.message = data.data.message; //Permet d'informer notre utilisateur sur l'état de sa requête
        });
    };
  });
