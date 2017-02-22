//Main Controller//

/*
Notre controller principal aura plusieurs fonctions essentielles à notre application.

Il va d'abord nous permettre de connaitre l'état de connexion de notre utilisateur (savoir si il est loggé ou non), c'est à dire vérifier si il est
en possession d'un token ou non.
On va également vérifier sur chaque changement de route si notre utlisateur est toujours loggé ou non et récupérer les informations de notre utilisateur
à chaque changement de route pour avoir toujours les dernières informations à jour.
On va également dans ce controller prendre en charge la connexion et la deconnexion de notre utilisateur sur notre application.
*/

angular.module('mainCtrl', [])

  .controller('mainController', function($rootScope, $location, Authenticate) {

    var vm = this;

    //Permet de savoir si l'utilisateur est logger ou non
    /*Cette fonction va nous permettre de vérifier si un utilisateur est bien loggé. Pour cela on va vérifier si il existe un token stocké dans
    l'espace de stockage locale du navigateur. On va utiliser pour cela la méthode getToken() de notre service AuthenticateToken*/
    vm.loggedIn = Authenticate.isLoggedIn(); //retourne true ou false

    /*L'objet $rootScope dans notre controller afin de faire référence au contexte global de l'application (contrairement à l'bjet
    $scope qui lui fait référence au contexte local d'un controller). Le service $rootScope d'Angular nous permet d'injecter dans n'importe quel
    controller de notre application le scope racine de la structure hiérarchique de nos scope. Cet objet va regrouper tous les scopes initialisés
    de notre application. Cet objet $rootScope va nous permettre d'envoyer et d'intercepter des événements personnalisés à travers les différents
    scope de notre application.*/
    /*Pour intercepter un évenement sous Angular on va utiliser la méthode $on.Cette méthode prend en argument deux paramètre: L'étiquette qui
    permet de caractériser l'évenement (dans notre cas $routeChangeStart) et la fonction à executer lorsque l'événement va être emis.*/
    /*$routeChangeStart est un événement du service $route. Il va être transmis au $rootScope avant le changement de route. C'est à dire qu'au moment
    où l'URL de notre navigateur va changer, le service $route va avertir qu'il est en train de faire le nécessaire pour que le changement de route se
    fasse et donc transmettre cet événement.*/
    /*Nous allons donc pouvoir prévoir le changement de route en utilisant $rootScope.$on('$routeChangeStart', function(){}) et éxécuter notre fonction
    lorsque cela arrivera.*/
    /*On va donc pourvoir vérifier si un utilisateur est toujours loggé sur chaques changement de routes (URL différentes). On va également récupérer
    les informations de l'utilisateur à chaque changement de route (cela va être utile pour notre interface nous y reviendrons).*/
    $rootScope.$on('$routeChangeStart', function() {

      vm.loggedIn = Authenticate.isLoggedIn(); //retourne true ou false


      //Cette fonction va nous permettre de récupérer les données associés à l'utilisateur loggé
      Authenticate.getUser()

        .then(function(data) {

           vm.user = data.data;
           


        });

    }); //Fin de $rootScope.$on()

    //Fonction pour gérer le formulaire de login
    /*Cette fonction va nous permettre de logger un utilisateur. Pour cela on va passer en argument à la fonction login() de notre service Authenticate le
    nom d'utilisateur et le mot de passe de celui ci qui seront contenu dans les variables vm.loginData.username et vm.loginData.password que l'on va
    lier à des inputs présent dans notre vue via la directive ng-model d'Angular. l'Utilisateur pour ensuite être redirigé vers notre page utilisateur
    grâce au service $location.*/
    vm.doLogin = function() {

      vm.error = '';

      /*Cette fonction va nous permettre de logger un utilisateur, c'est à dire lui permettre de récupérer le token nécessaire pour pourvoir
      'emprunter' les routes protégées de notre API. On passe en argument le userName et le password fournis par l'utilisateur*/
      Authenticate.login(vm.loginData.username, vm.loginData.password)
        .then(function(data) {


          if(data.success) {
            //L'utilisateur est redirigé vers la page /users
            /*$location est un service Angular. Il va nous permettre d'agir sur l'URL de notre navigateur grâce à l'utilisateur de l'objet window.location
            de notre navigateur contenant les méthode nous permettant de modifier notre URL. On l'utilise donc lorsque l'on souhaite changer l'URL de
            notre navigateur. La méthode path() de ce service permet si il est appelé avec un paramètre de changer le chemin de notre URL. */
             $location.path('/');
             console.log(vm.user);

          }
          else {
            vm.error = data.message;
          }



        });
    };

    //Fonction pour delogger un utilisateur
    /*Cette fonction va s'occuper d'invoquer la fonction Authenticate.logout() de notre service Authenticate qui va supprimer le token présent sur
    notre espace local de stockage ainsi que de supprimer les informations contenu dans l'objet vm.user de notre controller. On va ensuite pouvoir
    rediriger notre utilisateur vers la page de login.*/

    vm.doLogout = function() {

      /*Cette fonction va nous permettre de délogger un utilisateur, c'est à dire supprimer le token stocké coté client. L'utilisateur ne pourra plus
      'emprunter' les routes protégées de noter API*/
      Authenticate.logout();

      //On va supprimer les informations sur l'utilisateur contenue dans l'objet vm.user
      vm.user = {};

      //On redirige alors l'utilisateur vers la page login
      /*$location est un service Angular. Il va nous permettre d'agir sur l'URL de notre navigateur grâce à l'utilisateur de l'objet window.location
      de notre navigateur contenant les méthode nous permettant de modifier notre URL. On l'utilise donc lorsque l'on souhaite changer l'URL de
      notre navigateur. La méthode path() de ce service permet si il est appelé avec un paramètre de changer le chemin de notre URL. */
      $location.path('/login');


    };



  });
