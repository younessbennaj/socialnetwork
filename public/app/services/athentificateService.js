/*Nous allons donc créer un service authenticateService afin d'authentifier notre utilisateur.*/

/*Création de notre service*/

/*/Pour nos services nous allons utiliser des factories qui vont créer un objet, lui attacher des propriétés et des fonctions, puis elles vont
retourner cet objet. Ces propriétés et fonctions seront accéssible dans notre controller. /*/

/* On va d'abord créer notre module authenticateService qui va regrouper nos 3 factories. Ce module pourra être injecter par exemple dans celui qui
contiendra nos controllers. Les propriétés et les fonctions de nos services seront alors accessible dans nos controllers.*/

angular.module('authenticateService', [])

  /*/ Authenticate factory pour logger notre utilisateur et récupérer les informations /*/

  //On injecte le module $http qui permet de faire des requêtes http sur notre API afin de communiquer avec elle
  //On injecte le module $q qui permet de retourner un objet promise. C'est à dire un objet qui représente une valeur qui n'est pas encore disponible
  //On injecte la factory AuthenticateToken afin de gérer les tokens

  /*Cette factory va nous permettre plusieurs choses que nous allons séparé en plusieurs fonctions:
    - Logger un utilisateur
    - Délogger un utilisateur
    - Vérifier si un utilisateur est bien loggé
    - Récupérer les informations de l'utilisateur loggé
  */

  .factory('Authenticate', function($http, $q, AuthenticateToken) {

    /*On va créer notre notre objet authenticateFactory qui va être renvoyer par notre factory après lui avoir passer les propriétés
    et les fonctions dont nous avons besoin*/
    var authenticateFactory = {};

    /*Cette fonction va nous permettre de logger un utilisateur, c'est à dire lui permettre de récupérer le token nécessaire pour pourvoir
    'emprunter' les routes protégées de notre API. On passe en argument le userName et le password fournis par l'utilisateur*/

    authenticateFactory.login = function(userName, password) {

      //Le service $http va nous permettre de faire une requête POST sur l'endpoint /api/authenticate de notre API
      //On va fournir dans notre requête un objet contenant notre userName et notre password
      return $http.post('/api/authenticate', {
        userName: userName,
        password: password
      }) //Ceci va nous retrouner une promise par défaut pour ne pas bloquer le code

      //Une fois que la promise est réalisé ou non on va pourvoir appeler une fonction de callback (pour les deux cas si besoin)
      //Le premier argument contien la fonction si la promise est bien réalisé et nous fournis les données dont on a besoin (objet renvoyer par notre API)
        .then(function(data) {
          //Va nous permettre de stocker notre token coté Client grace au service AuthenticateToken
          AuthenticateToken.setToken(data.token);
          //On va renvoyer les données de notre utilisateur
          return data;
        })
    }; //fin de la fonction authenticateFactory.login();

    /*Cette fonction va nous permettre de délogger un utilisateur, c'est à dire supprimer le token stocké coté client. L'utilisateur ne pourra plus
    'emprunter' les routes protégées de noter API*/
    authenticateFactory.logout  = function() {

      //Nous permet de supprimer le token coté client
      AuthenticateToken.setToken();

    }; //Fin de la fonction authenticateFactory.logout()

    /*Cette fonction va nous permettre de vérifier si un utilisateur est bien loggé. Pour cela on va vérifier si il existe un token stocké dans
    l'espace de stockage locale du navigateur. On va utiliser pour cela la méthode getToken() de notre service AuthenticateToken*/
    authenticateFactory.isLoggedIn = function() {

      //Si il existe un token stocké coté client
      if(AuthenticateToken.getToken()) {
        return true;
      }
      //Si il n'existe pas de token coté client
      else {
        return false;
      }

    }; //Fin de la fonction authenticateFactory.isLoggedIn()


    //Cette fonction va nous permettre de récupérer les données associés à l'utilisateur loggé
    authenticateFactory.getUser = function() {
      //Si un utilisteur est loggé
      if(AuthenticateToken.getToken()) {
        //On va faire une méthode get sur l'endpoint api/me de notre API
        return $http.get('api/me');
      }
      else {
        return $q.reject({message: 'l\'utilisateur n\'a pas de token'});
      }
    };//Fin de la fonction authenticateFactory.getUser()

    return authenticateFactory;

  }) //Fin de la factory Authenticate



  /*/AuthenticateToken factory pour gérer les tokens/*/

  //On injecte le module $window pour pouvoir stocker le token coté client ($window est l'objet qui représente notre navigateur)

  /*Cette factory va nous permettre de stocker ou de récupérer notre token dans l'espace de stockage local de notre navigateur. */

  .factory('AuthenticateToken', function($window) {

    /*On va créer notre notre objet authenticateTokenFactory qui va être renvoyer par notre factory après lui avoir passer les propriétés
    et les fonctions dont nous avons besoin*/
    var authenticateTokenFactory = {};

    //Cette fonction va nous permettre de récupérer notre token sur l'espace local de stockage de notre navigateur
    authenticateTokenFactory.getToken = function() {
      //$window est un objet qui représent la fenêtre ouverte de notre navigateur
      /*La propriété localStorage de notre objet $window va nous permette de retourner une référence à l'objet de stockage local qui est utilisé pour
      stocker les données*/
      /*la méthode getItem() de l'objet localStorage nous permet de stocké une donnée dans cet objet en placant le nom de la propriété de l'ojbet en
      argument de la méthode, dans notre cas la propriété associé à notre token.*/
      return $window.localStorage.getItem('token');
    };

    //Cette fonction va nous permettre de stocker ou récupérer notre token sur l'espace local de stockage de notre navigateur
    //On va lui passer en argument un token si l'on veut le stocker sur l'espace local de stockage
    //On ne lui passe par d'argument si on veut supprimer le token qui se trouve sur notre espace
    authenticateTokenFactory.setToken = function(token) {
      //$window est un objet qui représent la fenêtre ouverte de notre navigateur
      /*La propriété localStorage de notre objet $window va nous permette de retourner une référence à l'objet de stockage local qui est utilisé pour
      stocker les données*/

      //Si on passe un token en argument
      if(token) {
        /*la méthode setItem() de l'objet localStorage nous permet de stocké une donnée dans cet objet. Le premier argument de cette méthode est le nom
        de la propriété que l'on veut créer et le deuxième argument est la valeur associé à cette propriété.*/
        return $window.localStorage.setItem('token', token);
      }
      //Si on ne passe pas de token en argument
      else {
        /*la méthode removeItem() de l'objet localStorage nous permet de supprimer une donnée dans cet objet. On passe en argument de cette méthode
        le nom de la propriété que l'on veut supprimer. Dans notre cas il s'agit de cette qui contient notre token.*/
        return $window.localStorage.removeItem('token');
      }

    };

    //la méthode getItem() de l'objet localStorage nous permet de stocké une nouvelle donnée dans cet objet

    return authenticateTokenFactory;

  }) // Fin de la factory AuthenticateToken

  /*/TokenToRequest factory pour attacher le token à chaque requête http/*/
  //On injecte le module $q qui permet de retourner un objet promise. C'est à dire un objet qui représente une valeur qui n'est pas encore disponible
  //On injecte la factory AuthenticateToken afin de gérer les tokens
  // On injecte le module $location qui va nous permettre de rediriger notre utilisateur en cas d'absence du token et sans rafraichissement de la page

  .factory('TokenToRequest', function($q, $location, AuthenticateToken) {

    /*On va créer notre notre objet tokenToRequestFactory qui va être renvoyer par notre factory après lui avoir passer les propriétés
    et les fonctions dont nous avons besoin*/
    var tokenToRequestFactory = {};

    /*Cette fonction décrit ce qu'il va se passer à chaque requête http.*/
    tokenToRequestFactory.request = function(config) {

      //On va récupérer notre token
      var token = AuthenticateToken.getToken();

      //Si le token existe on va alors l'attacher au header de notre requête en tant que valeur de "x-access-token"
      if(token) {

        config.headers['x-access-token'] = token;

        return config;
        
      }

    };

    /*Cette fonction décrit ce qu'il va se passer à chaque que notre serveur renvoi un message d'erreur*/

    tokenToRequestFactory.responseError = function(response) {
      //Si notre serveur renvoi une erreur 403
      if(response.status == 403) {
        //On va supprimer le token
        Authenticate.setToken();
        //On va rediriger l'utilisateur sur la page login
        $location.path('/login');
      } //Fin du if

      return $q.reject(response);

    };//Fin de la fonction responseError

    return tokenToRequestFactory;

  }); // Fin de la factory TokenToRequest
