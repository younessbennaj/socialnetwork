//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService'])

  .controller('userController', function(User) {

    var vm = this;

    User.all()
      .then(function(data) {

        console.log(data);

        //On va stocké nos utilisateurs dans la variable vm.users
        vm.users = data.data;

      });
  });
