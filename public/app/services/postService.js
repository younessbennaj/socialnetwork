/*Notre service va nous permettre de retrourner les données de nos appels vers l'API grâce aux méthodes http*/

/*Le service $http de Angular va nous permettre de communiquer avec le backend et de pouvoir faire des requêtes http. */

angular.module('postService', [])

.factory('Post', function($http) {

  var postFactory = {};


  //Nous permet de retrouner la liste de tout les posts
  postFactory.all = function() {
    return $http.get('api/posts');
  }

  //Nous permet de créer un nouveau post
  postFactory.create = function(postData) {
    return $http.post('api/posts', postData);
  }

  return postFactory;

});
