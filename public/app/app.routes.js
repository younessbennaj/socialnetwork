//Dans ce fichier nous allons configurer notre module afin qu'il prenne en compte le routing
angular.module('app.routes', ['ngRoute'])

  //Le routing de notre application va consister à associé une URL à un template et au controller associé

  .config(function($routeProvider, $locationProvider) {

    //On va énumérer nos règles de routing les unes après les autres.

    $routeProvider
    //Chaque règle est composé de l'URL pour laquelle la règle va s'appliquer et d'un JSON qui contient le template à charger ainsi que le controller associé

      //La route pour notre home page
      .when('/', {
        templateUrl: 'app/views/pages/home.html',
        controller: 'postController',
        controllerAs: 'post'
      })

      //La route pour la page login
      .when('/login', {
        templateUrl: 'app/views/pages/login.html',
        controller: 'mainController',
        controllerAs: 'login'
      })

      //La route pour lister tous nos utilisateurs
      .when('/users/:user_id', {
        templateUrl: 'app/views/pages/users/all.html',
        controller: 'friendController',
        controllerAs: 'friend'
      })

      // La route pour la page d'inscription
      .when('/signup', {
        templateUrl: 'app/views/pages/signup.html',
        controller: 'signupController',
        controllerAs: 'user'
      })

      //La route pour la page d'un utilisateur unique
      .when('/:user_id', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userController',
        controllerAs: 'user'
      })

      //La route pour la page pour la page de modification utilisateur
      .when('/edit/:user_id', {
        templateUrl: 'app/views/pages/users/edit.html',
        controller: 'userEditController',
        controllerAs: 'user'
      })

      //La route pour afficher la liste d'amis d'un utilisateur
      .when('/friends/:user_id', {
        templateUrl: 'app/views/pages/users/friends.html',
        controller: 'friendController',
        controllerAs: 'friend'
      });

    //On peut ajouter une dernière règle (otherwise()) qui permet de définir la règle par défaut si aucune règle n'a matché

    $locationProvider.html5Mode(true);

  });
