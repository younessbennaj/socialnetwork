//Dans ce fichier nous allons configurer notre module afin qu'il prenne en compte le routing
angular.module('app.routes', ['ngRoute'])

  //Le routing de notre application va consister à associé une URL à un template et au controller associé

  .config(function($routeProvider, $locationProvider) {

    //On va énumérer nos règles de routing les unes après les autres.

    $routeProvider
    //Chaque règle est composé de l'URL pour laquelle la règle va s'appliquer et d'un JSON qui contient le template à charger ainsi que le controller associé
      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      });

    //On peut ajouter une dernière règle (otherwise()) qui permet de définir la règle par défaut si aucune règle n'a matché

    $locationProvider.html5Mode(true);
  });
