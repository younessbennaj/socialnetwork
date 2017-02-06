angular.module("socialApp", [
  'ngAnimate',
  'app.routes',
  'authenticateService',
  'mainCtrl',
  'userCtrl',
  'userService'
])

/*Maintenant que notre utilisateur est loggé et que son token est stocké dans son espace de stockage local, il faut maintantn attacher ce token
à chaque requête http.*/

/*Le service $http de Angular va nous permettre de communiquer avec le backend et de pouvoir faire des requêtes http. Mais il existe certains cas où nous
avons besoin d'intercepter certaines requêtes afin de les manipuler avant que celles ci soit envoyer au serveur ou d'intercepter certaines réponses. C'est
à dire tout simplement executer une certaine logique avant ou après une requête http. C'est par exemple le cas dans un système d'authentification par tokens,
où nous avons besoin d'attacher notre token à chaque requêtes envoyer à notre API. Dans ce cas là les intercepteurs $http deviennent très utiles.
Un des moyens d'implémenter un intercepteur est de créer un service qui contiendra notre logique dans des fonctions. On va ensuite "pusher" ce service
dans le tableau qui contient ces intercepteurs http. Il existe types d'intercepteurs: Request, Response, Request Error et Response Error.
$httpProvider.interceptors.push('TokenToRequest') va nous permettre de manipuler les requêtes http. Le provider $httpProvider va contenir un tableau
d'intercepteur qui sont simplement des services Angular que l'ont a crée.*/

/*Request intercepteur:

Cette fonction prend en argument un objet config et retourne cet objet modifié. la logique de notre intercepteur contenu dans la factory TokenToRequest
qui va nous permettre de récupérer le token coté client et de l'attacher au header de notre requête http en tant que en tant que valeur de "x-access-token".
Donc lorsqu'une requête est lancée, notre token va être attaché au header de notre requête en tant que valeur de "x-access-token".
Cette méthode va être appelé avant que le service $http envoi la requête au backend.
*/

/*ResponseError Interceptor:

Cette fonction prend en argument un objet promise et retourne cet objet résolu. Dans notre exemple nous allons prendre en charge les erreurs 403 (accès refusé).
Donc si la requête retourne un message de succès on ne va rien faire. Si il renvoi un message d'erreur on va vérifier le code de cette erreur. Si le code
de cette erreur est le 403 alors on va supprier le token coté navigateur et on va rediriger l'utilisatuer vers la page login.
Cette méthode va être appelé juste après que notre service $http reçoive la réponse de notre backend.
*/

/*On est pas obligé d'implémenter ces fonctions dans deux factory différentes. Dans notre cas nous avons choisi de les combiner dans une seule factory.*/

/*Le provider $httpProvider contient un tableau de ces intercepteur. Pour qu'un intercepteur soit utiliser il faut alors pusher notre intercepteur dans
ce tableau. Pour cela on le fait en utilisant le nom de notre service et on l'ajoute au tableau $httpProvider.interceptors. */

.config(function($httpProvider) {

  $httpProvider.interceptors.push('TokenToRequest');

});
