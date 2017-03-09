angular.module('friendCtrl', ['userService'])

  .controller('friendController', function($routeParams, User) {

    var vm = this;

    //On affiche par défaut la vue de la liste de nos amis
    vm.type = 'friends';

    /*/CHECKFRIENDS: AFFICHER NOS AMIS/*/

    /*/L'objectif de cette fonction est de permettre d'afficher dans la vue seulement les profils utilisateur dont le status d'amis est
    confirmé/*/

    vm.checkFriends = (function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'friends';




          User.get($routeParams.user_id)
            .then(function(data) {

              //Une fois nos amis ajouté il faut les faire apparaitre dans la vue avec le status (en attente de confirmation)
              //L'objectif est d'aller chercher dans le tableau "friends" de notre utilisateur les Id de nos amis
              vm.friendsProfil = [];
              var friends = [];
              var users = [];



              //On va stocker nos amis dans le tableau friends déclaré au dessus

              for(var i = 0; i < data.data.friends.length; i++) {

                if(data.data.friends[i].status == 'confirmed') {

                  friends.push(data.data.friends[i].friendId);

                }


              };

              //On aller chercher nos amis dans notre API
              //On va le stocker dans notre tableau d'utilisateur

              for(var i = 0; i < friends.length; i++) {

                User.get(friends[i])
                  .then(function(data) {
                    users.push(data.data);

                    vm.friendsProfil = users;
                    console.log(vm.friendsProfil);

                  });

              };




            });

    }); 




    /*/CHECKREQUESTS: AFFICHER NOS DEMANDES D'AMIS/*/

    /*/L'objectif de cette fonction est de permettre d'afficher dans la vue seulement les profils utilisateur dont le status d'amis est
    en attente/*/

    vm.checkRequests = function() {
      //On change le type afin d'afficher la vue correspondante

      vm.type = 'requests';
      vm.friendsRequet = [];

      User.get($routeParams.user_id)
        .then(function(data) {

          //Une fois nos amis ajouté il faut les faire apparaitre dans la vue avec le status (en attente de confirmation)
          //L'objectif est d'aller chercher dans le tableau "friends" de notre utilisateur les Id de nos amis
          var requestFriends = [];
          var requestUsers = [];



          //On va stocker nos amis dans le tableau friends déclaré au dessus

          for(var i = 0; i < data.data.friends.length; i++) {

            if(data.data.friends[i].status === 'request') {

              requestFriends.push(data.data.friends[i].friendId);


            }


          };




          //On aller chercher nos amis dans notre API
          //On va le stocker dans notre tableau d'utilisateur

          for(var i = 0; i < requestFriends.length; i++) {

            User.get(requestFriends[i])
              .then(function(data) {


                requestUsers.push(data.data);

                vm.friendsRequet = requestUsers;



              });

          };








        });


    };



    /*/FINDFRIENDS: AFFICHER DES FUTURS AMIS POTENTIELS/*/

    /*/L'objectif de cette fonction est d'afficher dans la vue tous les utilisateurs qui ne sont pas encore amis avec l'utilisateurs/*/

    /*/Dans cette vue on va lister tous les utilisateurs qu'il est possible d'ajouter en amis. Ils vont être ranger en ordre alphabétique
    et on va pouvoir effectuer une recherche d'utilisateur. /*/

    vm.findFriends = function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'find';

      //On va récupérer tous nos utilisateurs via notre API
      User.all()
        .then(function(data) {

          var users = data.data;



          //On veut ensuite afficher dans la vue seulement les utilisateurs qui ne sont pas déjà nos amis
          User.get($routeParams.user_id)
            .then(function(data) {
              //On récupère notre utilisateur
              var userFriends = data.data.friends;

              for(var i = 0; i < userFriends.length; i++) {

                //On va retrouver l'index de notre ami dans le tableau user
                var friendPosition = users.map(function(friend) {
                  return friend._id;
                }).indexOf(userFriends[i].friendId);


                users.splice(friendPosition, 1);

              }

              //On supprime notre utilisateur

              var userPosition = users.map(function(user) {
                return user._id;
              }).indexOf($routeParams.user_id);

              users.splice(userPosition, 1);


              vm.users = users;



            })



    });

  };

    //Cette fonction est déclanché lorsque l'on clique sur "Ajouter à mes amis"

    vm.addFriends = function(friend) {

      User.get($routeParams.user_id)
        .then(function(data) {

          //On va récupérer notre utilisateur et le stocker dans la variable user

          var user = data.data;

          /*
          3 types de status pour un ami:
          - request: C'est quand cet amis nous a fait une demande, il n'est donc pas encore confrimé
          - demand: C'est quand on a fait une demande à cet amis, on attend sa confirmation
          - confirmed: C'est quand la demande à été confirmé et le status est confirmed pour les deux

          */

          //On va pusher dans le tableau contenant les amis de notre utilisateur l'Id de l'utilisateur qu'il souhaite ajouer à sa liste d'amis

          user.friends.push({friendId: friend._id, status: 'demand'}); //On a fait une demande à cet ami

          //On va pusher dans le tableau contenant les amis de notre amis l'Id de notre utilisateur qui souhaite l'ajouer à sa liste d'amis

          friend.friends.push({friendId: user._id, status: 'request'}); //Notre utilisateur à fait une demande à cet ami

          //On va ensuite mettre à jour notre utilisateur dans notre API pour que la modification soit permanante

          User.update($routeParams.user_id, user)
            .then(function(data) {

            });

          //On va ensuite mettre à jour notre amis dans notre API pour que la modification soit permanante

          User.update(friend._id, friend)
            .then(function(data) {

            });

          //On doit ensuite pouvoir supprimer la possibilité pour notre utilisateur d'ajouter de nouveau cet amis en desactivant le bouton

          friend.isFriend = true;

        });


    }; //Fin de de addFriends

    vm.acceptRequest = function(friend) {

      //L'objectif est de faire passer le status de l'amis de "request" à "confirmed" dans le tableau de l'utilisateur qui accepte
      User.get($routeParams.user_id)
        .then(function(data) {

          //On va stocké la liste des amis de notre utlisateur

          var user = data.data

          var friends = user.friends;


          //On va ensuite retrouné la position dans ce tableau de l'amis dont on souhaite accepter l'invitation

          var friendPosition = friends.map(function(friend) {
            return friend.friendId;
          }).indexOf(friend._id);


          //L'objectif est de changer l'objet représenant cet ami et plus particulièrement sa propriété status

          friends[friendPosition].status = 'confirmed';

          //On va ensuite mettre à jour notre utilisateur dans notre API

          User.update($routeParams.user_id, user)
            .then(function(data) {

            });


          //On va mettre à jour notre ami dans notre API pour que le changement soit permanant

          //On va chercher dans le tableau de amis de notre ami notre utilisateur

          var userPosition = friend.friends.map(function(user) {
            return user.friendId;
          }).indexOf($routeParams.user_id);

          //On va changer la propriété status de l'objet qui représente notre utilisateur
          friend.friends[userPosition].status = 'confirmed';

          User.update(friend._id, friend)
            .then(function(data) {



            });

          friend.isFriend = true;

        });

    } //Fin de acceptRequest();

    vm.deleteFriends = function(friend) {

      User.get($routeParams.user_id)
        .then(function(data) {

          var user = data.data;

          var friendPosition = user.friends.map(function(friend) {
            return friend.friendId;
          }).indexOf(friend._id);

          user.friends.splice(friendPosition, 1);

          var userPosition = friend.friends.map(function(user) {
            return user.friendId;
          }).indexOf(user._id);

          friend.friends.splice(userPosition, 1);

          User.update(user._id, user)
            .then(function(data) {


              friend.isNotFriend = true;
            });

          User.update(friend._id, friend)
            .then(function(data) {


            })



        });
    }

  });
