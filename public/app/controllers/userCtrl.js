//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService'])

  .controller('userController', function(User) {

    var vm = this;

    /*Pour des raisons pratiques nous allons séparer la logique de l'inscription de la logique gloable lié à l'utilisateur sinon dans
    la console on va nous renvoyer un message d'erreur 403*/

    User.all()
      .then(function(data) {

        console.log(data);

        //On va stocké nos utilisateurs dans la variable vm.users
        vm.users = data.data;

      });

    // vm.saveUser = function() {
    //
    //   //On va clearer notre message
    //   vm.message = '';
    //
    //   //On va faire appelle à la fonction create() de notre service User qui va nous permettre de créer un nouvel utilisateur
    //   //Cette fonction va prendre ne argument l'objet qui contient les différentes informations de notre utilisateur nécessaire à sa création
    //   User.create(vm.userData)
    //     .then(function(data) {
    //
    //       //On va clearer le formulaire d'inscription
    //       vm.userData = {};
    //
    //       vm.message = data.data.message; //Permet d'informer notre utilisateur sur l'état de sa requête
    //     });
    // };
  });
