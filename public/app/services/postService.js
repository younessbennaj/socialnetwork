/*Notre service va nous permettre de retrourner les données de nos appels vers l'API grâce aux méthodes http*/

/*Le service $http de Angular va nous permettre de communiquer avec le backend et de pouvoir faire des requêtes http. */

angular.module('postService', [])

.factory('Post', function($http) {

  var postFactory = {};

  //Nous permet de retourner les données d'un post unique grâce à son ID
  postFactory.get = function(id) {
    return $http.get('api/posts/' + id);
  }


  //Nous permet de retrouner la liste de tout les posts
  postFactory.all = function() {
    return $http.get('api/posts');
  }

  //Nous permet de créer un nouveau post
  postFactory.create = function(postData) {
    return $http.post('api/posts', postData);
  }

  //Mettre à jour un post
  postFactory.update = function(id, postData) {
    return $http.put('api/posts/' + id, postData);
  }

  return postFactory;

});
