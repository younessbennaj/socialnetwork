//Nous allons lui injecter le module postService dans notre module postCtrl car nous allons avoir besoin de notre postFactory

angular.module('postCtrl', ['postService', 'userService', 'authenticateService'])

  .controller('postController', function(Post, User, Authenticate) {

    var vm = this;

    /*Pour des raisons pratiques nous allons séparer la logique de l'inscription de la logique gloable lié à l'utilisateur sinon dans
    la console on va nous renvoyer un message d'erreur 403*/

    Post.all()
      .then(function(data) {

        //On va stocké nos utilisateurs dans la variable vm.users
        vm.posts = data.data;


      });

      //Permet de récupérer les données de l'utilisateur connecté. On va utiliser ces données pour les attacher au post que l'utilisateur va créer

    Authenticate.getUser()

      .then(function(data) {

          vm.user = data.data;

      });



      vm.savePost = function() {

        //On va associé le nom et le prénom de l'utilisateur au post de ce dernier

        vm.postData.userFirstName = vm.user.firstName;
        vm.postData.userLastName = vm.user.lastName;
        vm.postData.postDate = new Date();

        console.log(vm.postData);

        //On va faire appelle à la fonction create() de notre service Post qui va nous permettre de créer un nouveau post
        //Cette fonction va prendre en argument l'objet qui contient les différentes informations de notre post nécessaire à sa création

        Post.create(vm.postData)
          .then(function(data) {

            //On va pusher nos données dans le tableau qui contient tout nos postes pour qu'Angular puisse binder ces données à la vue

            console.log(vm.postData);
            vm.posts.push(vm.postData);

            //On va clearer le formulaire de création de posts
            vm.postData = {};


            // vm.message = data.data.message; //Permet d'informer notre utilisateur sur l'état de sa requête
          });
      };

  });
