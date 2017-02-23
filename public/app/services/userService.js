/*Notre service va nous permettre de retrourner les données de nos appels vers l'API grâce aux méthodes http*/

/*Le service $http de Angular va nous permettre de communiquer avec le backend et de pouvoir faire des requêtes http. */


angular.module('userService', [])
  .factory('User', function($http) {

    var userFactory = {};

    //Nous permet de retourner les données d'un utilisateur unique grâce à son ID
    userFactory.get = function(id) {
      return $http.get('api/users/' + id);
    }

    //Nous permet de retrouner la liste de tout les utilisateurs
    userFactory.all = function() {
      return $http.get('api/users');
    }

    //Nous permet de créer un nouvel utilisateur
    userFactory.create = function(userData) {
      return $http.post('api/users', userData);
    }

    //Mettre à jour un utilisateur
    userFactory.update = function(id, userData) {
      return $http.put('api/users/' + id, userData);
    }

    //Nous permet de supprimer un utilisateur
    userFactory.delete = function(id) {
      return $http.delete('api/users/' + id);
    }

    return userFactory;

  });
