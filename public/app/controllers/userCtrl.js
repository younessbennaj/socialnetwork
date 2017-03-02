//Nous allons lui injecter le module userService dans notre module userCtrl car nous allons avoir besoin de notre userFactory

angular.module('userCtrl', ['userService', 'postService'])

  .controller('userController', function($routeParams, User, Post) {

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

    // vm.addFriends = function(friend, userId) {
    //
    //   console.log('add');
    //
    //   var isFriend;
    //
    //   User.all()
    //     .then(function(data) {
    //
    //       vm.users = data.data;
    //
    //       //On va retrouver notre utilisateur et placer dans son tableau d'amis l'ID de l'utilisateur qu'il souhaite ajouter
    //
    //       for(var i = 0; i < vm.users.length ; i++) {
    //
    //         if(vm.users[i]._id == userId) {
    //
    //           //Va nous mettre de vérifier si cet utilisateur ne fait pas déjà parti de nos amis
    //
    //           for(var j = 0; j < vm.users[i].friends.length; j++) {
    //
    //             if(vm.users[i].friends[j].friend == friend._id) {
    //
    //               console.log('déjà amis');
    //               isFriend = true;
    //
    //             }
    //
    //
    //
    //           };
    //
    //
    //
    //           if(!isFriend) {
    //
    //             //On va placer l'Id de notre nouvel ami dans notre tabeau amis
    //
    //             //On ajoute l'utilisateur dans la liste d'amis avec le status "waiting"
    //             vm.users[i].friends.push({friend: friend._id, waiting: true});
    //             //On ajoute l'utilisateur dans la liste d'amis avec le status "waiting"
    //             friend.friends.push({friend: userId, waiting: true});
    //
    //             friend.notifications.push({type: 'friend'});
    //
    //             console.log(friend.notifications);
    //
    //
    //
    //
    //             //On va mettre à jour notre utilisateur en lui passant le nouveau tableau des amis mis à jour
    //
    //
    //             User.update(userId, vm.users[i])
    //
    //             .then(function(data) {
    //
    //             });
    //
    //             //On va également mettre à jour notre futur amis en lui passant le nouveau tableau contenant l'Id de notre utilisateur
    //
    //             User.update(friend._id, friend)
    //
    //             .then(function(data) {
    //
    //               console.log(data.data);
    //
    //             });
    //
    //
    //
    //           }
    //
    //
    //         }
    //
    //       }
    //
    //     });
    //
    //
    //
    //
    // }; //Fin de addFriends


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

  // .controller('userFriendController', function($routeParams, User) {
  //
  //   var vm = this;
  //   vm.friends = [];
  //
  //   User.all()
  //     .then(function(data) {
  //
  //       vm.users = data.data;
  //
  //       User.get($routeParams.user_id)
  //         .then(function(data) {
  //           vm.user = data.data;
  //
  //
  //           for(var i = 0; i < vm.user.friends.length; i++) {
  //
  //             for(var j = 0; j < vm.users.length; j++) {
  //
  //               if(vm.user.friends[i].friend == vm.users[j]._id) {
  //
  //                 vm.friends.push(vm.users[j]);
  //               }
  //
  //             }
  //
  //           }
  //
  //           console.log(vm.friends);
  //
  //         })
  //
  //
  //   });
  //
  //
  //
  //
  // });
