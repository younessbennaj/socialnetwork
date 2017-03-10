//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService', 'postService', 'authenticateService'])

  .controller('userController', function($routeParams, User, Post, Authenticate) {

    var vm = this;

    /*Pour des raisons pratiques nous allons séparer la logique de l'inscription de la logique gloable lié à l'utilisateur sinon dans
    la console on va nous renvoyer un message d'erreur 403*/

    User.all()
      .then(function(data) {

        //On va stocké nos utilisateurs dans la variable vm.users
        vm.users = data.data;


      });

    User.get($routeParams.user_id)
      .then(function(data) {

        vm.user = data.data;

      });

    Post.all()
      .then(function(data) {

        vm.postUser = [];

        for(var i = 0; i < data.data.length; i++) {
          if(data.data[i].userId == $routeParams.user_id) {
            vm.postUser.push(data.data[i]);
          }


        }


      })

      //Permet d'afficher l'espace commentaire d'un post

    vm.showComment = function(postId) {

      //Nous permet de trouver le post correspondant aux commentaire qu'on veut afficher

      for(var i = 0; i < vm.postUser.length; i++) {
        if(vm.postUser[i]._id == postId ) {

          //On passe la variable permettant de faire apparraitre les commentaires à true ou false en fonction des besoins
          vm.postUser[i].commentClicked = !vm.postUser[i].commentClicked;
        }
      }

    };

    vm.savePost = function(user) {


      //On va associé le nom et le prénom de l'utilisateur au post de ce dernier
      vm.postData.userFirstName = user.firstName;
      vm.postData.userLastName = user.lastName;
      vm.postData.userId = user._id;
      vm.postData.type = "profil";
      vm.postData.postDate = new Date();




      //On va faire appelle à la fonction create() de notre service Post qui va nous permettre de créer un nouveau post
      //Cette fonction va prendre en argument l'objet qui contient les différentes informations de notre post nécessaire à sa création

      Post.create(vm.postData)
        .then(function(data) {

          //On va pusher nos données dans le tableau qui contient tout nos postes pour qu'Angular puisse binder ces données à la vue
          vm.postUser.push(data.data.post);

          //On va clearer le formulaire de création de posts
          vm.postData = {};


          // vm.message = data.data.message; //Permet d'informer notre utilisateur sur l'état de sa requête
        });

    }; //Fin de la fonction savePost

    var isFriend = (function() {

      User.get($routeParams.user_id)
        .then(function(data) {

          var friends = data.data.friends;

          Authenticate.getUser()

            .then(function(data) {

               for(var i = 0; i < friends.length; i++) {
                 if(friends[i].friendId === data.data._id)  {
                   vm.isFriend = true;
                 }

               }



            });
        })
    })();

    var isMyProfil = (function() {


          Authenticate.getUser()

            .then(function(data) {

               if($routeParams.user_id === data.data._id) {
                 vm.isFriend = true;
                 vm.itsMe = true;
               }

              console.log(data.data);

            });

  })();

  }) //Fin de userController

  .controller('userEditController', function($routeParams, User) {

    var vm = this;

    //On récupère un utlisateur unique grâce à son Id

    User.get($routeParams.user_id)
      .then(function(data) {

        vm.userData = data.data;

      });


      vm.saveUser = function() {

        User.update($routeParams.user_id, vm.userData)
          .then(function(data) {

            vm.userData = {};

          });
      };
  });
