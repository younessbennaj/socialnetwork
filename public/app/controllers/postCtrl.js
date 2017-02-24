//Nous allons lui injecter le module postService dans notre module postCtrl car nous allons avoir besoin de notre postFactory

angular.module('postCtrl', ['postService', 'userService', 'authenticateService'])

  .controller('postController', function(Post, User, Authenticate) {


    var vm = this

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




        //On va faire appelle à la fonction create() de notre service Post qui va nous permettre de créer un nouveau post
        //Cette fonction va prendre en argument l'objet qui contient les différentes informations de notre post nécessaire à sa création

        Post.create(vm.postData)
          .then(function(data) {

            //On va pusher nos données dans le tableau qui contient tout nos postes pour qu'Angular puisse binder ces données à la vue
            vm.posts.push(data.data.post);

            //On va clearer le formulaire de création de posts
            vm.postData = {};


            // vm.message = data.data.message; //Permet d'informer notre utilisateur sur l'état de sa requête
          });
      }; //Fin de la fonction savePost



      /*/ Updatalike() /*/


      /*Cette fonction va permettre à nos utilisateur de pourvoir "liker" une publication.*/
      //On va récupérer à la fois l'Id de l'utilisateur et celui du post
      vm.updateLike = function(postId, userId) {

        var isLiked;

        //On va utiliser la méthode get pour récupérer un post unique sur lequel on a cliquer 'like' grâce à son Id
        Post.get(postId)
          .then(function(data) {

            //On va récupérer les données du post sur lequel on cliquer sur "like"

            vm.postLikeData = data.data;

            //Va nous permettre de savoir si un utilisateur à déjà liker la publication

            for(var i = 0; i < vm.postLikeData.likes.length; i++) {
              if(vm.postLikeData.likes[i] == userId) {
                isLiked = true;

                }
            }



            //Si l'utilisateur n'a pas encore liker la publication alors on incrémente le compteur à like
            if(!isLiked) {

              //On va stocker danns le tableau l'id de l'utilisateur qui à liker la publication
              vm.postLikeData.likes.push(userId);

              //On fait appelle à la fonction update de notre service post pour mettre à jour le post
              Post.update(postId, vm.postLikeData)
              .then(function(data) {

                console.log(data.data);

                //En réponse le serveur va nous renvoyer le post mis à jour

                //On va ensuite boucler notre tableau des posts pour mettre à jour notre post (likes) pour mettre à jour notre vue
                for(var i = 0; i < vm.posts.length; i++) {
                  if(vm.posts[i]._id == postId ) {
                    vm.posts[i].likes =  data.data.post.likes;
                  }
                }
              }); //Fin du update

            }
            //Sinon

            else {

              isLiked = false;

              //On va utiliser la méthode get pour récupérer un post unique sur lequel on a cliquer 'like' grâce à son Id
              Post.get(postId)
                .then(function(data) {

                    //On va récupérer les données du post sur lequel on cliquer sur "like"

                    vm.postDislikeData = data.data;

                    //On va supprimer l'Id de l'utilisateur dans le tableau des likes
                    for(var i = 0 ; i < vm.postDislikeData.likes.length; i++) {

                      if(vm.postDislikeData.likes[i] == userId) {

                          vm.postDislikeData.likes.splice(i,1);


                        }

                    }


                    //On fait appelle à la fonction update de notre service post pour mettre à jour le post
                    Post.update(postId, vm.postDislikeData)
                    .then(function(data) {

                      console.log(data.data);

                      // En réponse le serveur va nous renvoyer le post mis à jour

                      // On va ensuite boucler notre tableau des posts pour mettre à jour notre post (likes) pour mettre à jour notre vue
                      for(var i = 0; i < vm.posts.length; i++) {
                        if(vm.posts[i]._id == postId ) {
                          vm.posts[i].likes =  data.data.post.likes;
                        }
                      }

                    }); //Fin du update

                });

           }


          }); //fin du get

      }; //Fin de la fonction updateLike()

      /*/Fonction showComment()/*/

      vm.showComment = function() {

        vm.commentClicked = !vm.commentClicked;



      };

      /*/Fonction updateComment()/*/

      vm.updateComment = function(postId, userId, postComment) {

        Post.get(postId)
          .then(function(data) {

            //On va stocker les données du post qu'on a récupéré
            vm.postCommentData = data.data;

            //On va stocker notre commentaire dans le tableau des commentaires de notre post
            vm.postCommentData.comments.push(postComment);

            //On clear le form de commentaire
            vm.postComment = "";

            //On va mettre à jour notre poste coté serveur dans notre API grâce à la méthode http put et la fonction update de notre service

            Post.update(postId, vm.postCommentData)
              .then(function(data) {

                for(var i = 0; i < vm.posts.length; i++) {
                  if(vm.posts[i]._id == postId ) {
                    vm.posts[i].comments =  data.data.post.comments;
                  }
                }

                

              });

          });



      };


  });
