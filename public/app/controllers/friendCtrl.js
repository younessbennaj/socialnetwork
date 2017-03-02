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
      var processing = true;


          User.get($routeParams.user_id)
            .then(function(data) {

              //Une fois nos amis ajouté il faut les faire apparaitre dans la vue avec le status (en attente de confirmation)
              //L'objectif est d'aller chercher dans le tableau "friends" de notre utilisateur les Id de nos amis
              var friends = [];
              var users = [];



              //On va stocker nos amis dans le tableau friends déclaré au dessus

              for(var i = 0; i < data.data.friends.length; i++) {

                friends.push(data.data.friends[i].friendId);

              };

              //On aller chercher nos amis dans notre API
              //On va le stocker dans notre tableau d'utilisateur

              for(var i = 0; i < friends.length; i++) {

                User.get(friends[i])
                  .then(function(data) {
                    users.push(data.data);

                    vm.users = users;

                  });

              };





            });

    }); //Cette fonction s'appelle toute seule par défaut comme ça on affiche directement nos amis




    /*/CHECKREQUESTS: AFFICHER NOS DEMANDES D'AMIS/*/

    /*/L'objectif de cette fonction est de permettre d'afficher dans la vue seulement les profils utilisateur dont le status d'amis est
    en attente/*/

    vm.checkRequests = function() {
      //On change le type afin d'afficher la vue correspondante
      vm.type = 'requests';

      User.get($routeParams.user_id)
        .then(function(data) {

          //Une fois nos amis ajouté il faut les faire apparaitre dans la vue avec le status (en attente de confirmation)
          //L'objectif est d'aller chercher dans le tableau "friends" de notre utilisateur les Id de nos amis
          var friends = [];
          var users = [];



          //On va stocker nos amis dans le tableau friends déclaré au dessus

          for(var i = 0; i < data.data.friends.length; i++) {

            friends.push(data.data.friends[i].friendId);

          };

          //On aller chercher nos amis dans notre API
          //On va le stocker dans notre tableau d'utilisateur

          for(var i = 0; i < friends.length; i++) {

            User.get(friends[i])
              .then(function(data) {
                users.push(data.data);

                vm.users = users;

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

          //Cependant dans cette liste on ne doit pas afficher notre utilisateur

          User.get($routeParams.user_id)
            .then(function(data) {

              /*/SUPPRIMER NOTRE UTILISATEUR/*/

              //On va chercher la position de notre utilisateurs dans le tableau global des utilisateurs

              var userPosition = users.map(function(user) {
                  return user._id;
              }).indexOf(data.data._id);

              //On va supprimer notre utilisateurs de ce tableau qu'il ne soit pas binder dans la vue

              users.splice(userPosition, 1);


              /*/SUPPRIMER NOS AMIS/*/

              //On va stocker nos amis dans un tableau friends
              var friends = [];

              for(var i = 0; i < data.data.friends.length; i++) {

                friends.push(data.data.friends[i]);

              };

              //On veut maintenant supprimer du tableau users les utilisateurs qui correspondent à ces Id

              for(var i = 0; i < friends.length; i++) {

                var friendPosition = users.map(function(friend) {
                  return friend._id;
                }).indexOf(friends[i]);

                users.splice(friendPosition, 1);

              };

              vm.users = users;

            //Ne pas faire apparaitre nos amis dans la vue

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

          var friends = data.data.friends;


          //On va ensuite retrouné la position dans ce tableau de l'amis dont on souhaite accepter l'invitation

          var friendPosition = friends.map(function(friend) {
            return friend.friendId;
          }).indexOf(friend._id);

          console.log(friends[friendPosition]);


        });

    }

  });
