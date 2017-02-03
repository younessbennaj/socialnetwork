//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService'])

  .controller('userController', function(User) {

    var vm = this;
  });
