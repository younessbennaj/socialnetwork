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

      //On va créer la fonction qui va nous permettre de récupérer l'utilisateur correspondant à chaque post
      /*L'idée est la suivante: A chaque post correspond un utilisateur qui est défini par son Id. On va donc grâce à cet Id pouvoir
      récupérer le nom et le prénom de l'utilisateur correspondant à ce post. */
      //


        Authenticate.getUser()

          .then(function(data) {

             vm.user = data.data;

             console.log(vm.user);



          });



      vm.savePost = function() {

        vm.postData.user_id = vm.user._id;

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


    // User.all()
    //   .then(function(data) {
    //
    //     vm.users = data.data;
    //   });


  });
