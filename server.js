//Server.js

//Notre application va faire appel au module express ainsi qu'à ses fonctionnalités
var express = require('express');
//body-parser va extraire la portion entière du body de notre request et va l'exposer via la propriété req.body
var bodyParser = require('body-parser');
//Mongoose est un module Node.js, il va servir de passerelle entre notre serveur Node.js et notre serveur MongoDB.
var mongoose = require('mongoose');
//On défini le port d'écoute
var morgan = require('morgan');
//Morgan va nous permettre de logger toutes les requêtes dans la console afin de comprendre ce qu'il se passe
var port = process.env.PORT || 8000;
//On défini notre app en utilisant express
var app = express();

//Configuration de notre midleware body-parser
//On va préciser que nous utilisons body-parser grâce à la méthode use en précisant que nous utlisons les méthodes urlencoded et json sur notre body-parser
/*urlencoded parse le texte qui est sous forme de données encodés de l'URL (format sous lequel le navigateur envoi habituellement les données
d'un formulaire envoyer avec la méthode POST) et le retourne sous forme d'objet accéssible via req.body*/
app.use(bodyParser.urlencoded({extended: true}));
//Extended permet de ne pas afficher les messages dans la console qui préciserais que nous utilisons urlencoded de façon obsolète
//Parse le text en tant que JSON et le rend accessible via req.body
app.use(bodyParser.json());
//En résumé cette configutation va nous permettre d'obtenir les données d'un POST

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
/* Ce script va nous permettre d'autoriser les requêtes CORS, c'est à dire les requêtes provenant de n'importe quelle domaine (utile dans la consctruction
d'une API). On permet donc à n'importe quel domaine d'accéder à notre API. */

//On demande à mongoose de se connecter à notre base de données MongoDB
mongoose.connect('mongodb://root:root@waffle.modulusmongo.net:27017/giDyp4yz');

//On va mainteant importer notre modèle pour pouvoir l'utiliser dans notre application (app/models/user.js)
var User = require('./app/models/user');

//Les routes//

/*Grâce à l'utilisation de la méthode Router() on va pouvoir être en mesure de sectionner notre site. On va par exemple pouvoir créer une instance
basicRouter pour gérer les routes de notre front-end par exemple et une autre instance apiRouter pour gérer celle qui sont lié à notre API. Une va
également pouvoir créer une instance adminRouter qui va nous permettre de gérer les routes lié au profil administrateur et qui vont être protégé
par une authentification. Utiliser ce principe de routage va nous permettre de compartementer notre application et nous donner la flexibilité dont
nous avons besoin dans la construction d'une application complèxe. */

// Routes pour notre API //


//On défini d'abord la route basique pour la home page
app.get('/', function(req, res) {
  res.send('Bienvenu sur notre reseau social !');
})

/*l'objet Router() comporte toutes les méthodes d'un objet de type express, dans notre cas nous allons utiliser principalement sa méthode Route()
qui va nous permettre de gérer les requêtes qui nous sont faites.*/
var apiRouter = express.Router();

apiRouter.use('/', function(req, res, next) {
  console.log(req.method, req.url);

  next();
});

apiRouter.get('/', function(req, res){ //Le middleware est moyen de faire quelque chose avant que la requête ne soit traité
  res.json({message: 'Notre route API à l\'air de fonctionner' });
  //C'est ici que l'on va vérifier si un utilisateur est authentifié
  next(); //Nous permet d'être sur que 'lon accède à la route suivante ou au prochain middleware
});

//On va définir les différentes méthodes sur les routes finissant par /users

apiRouter.route('/users')

  //On va créer un user (methode POST sur l'URL http://localhost:8000/api/users)
  .post(function(req, res) {
    //On va créer une nouvelle instance de notre model User
    var user = new User();

    //On va ensuite stocker les informations de l'utilisateurs provenant de la requête
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userName = req.body.userName;
    user.password = req.body.password;

    //On va sauvegarder notre utilisateur et vérifier s'il y a des erreurs
    user.save(function(err) {
      if(err) {

        if(err.code == 11000) { //Nous permet de vérifier si un utilisateur existe déjà
          return res.json({ success: false, message: 'Un utilisateur avec ce nom d\'utilisateur existe déjà.'});
        }
        else {
          return res.send(err);
        }
      }
      else {
        res.json({message: 'Utilisateur crée avec succès !'});
      }
    });
  })

  //On va recupérer tous les utilisateurs (Méthode GET sur l'URL http://localhost:8000/api/users )
  .get(function(req, res) {

    User.find(function(err, users) {
      if(err) {
        res.send(err);
      }
      else {
        res.json(users);
      }
    });
  });

apiRouter.route('/users/:user_id')

    //On va recupérer un seul utilisateur (Méthode GET sur l'URL http://localhost:8000/api/users/:user_id )

  .get(function(req, res) {

    //La methode findById() de notre model permet de trouver l'utilsateur que l'on veut grâce à l'Id que l'on récupère dans la requète
    User.findById(req.params.user_id, function(err, user) {

      if(err) {
        res.send(err);
      }
      else {
        res.json(user);
      }

    });
  })

  //On va modifier un seul utilisateur (Méthode PUT sur l'URL http://localhost:8000/api/users/:user_id )

  .put(function(req, res) {

    //La methode findById() de notre model permet de trouver l'utilsateur que l'on veut grâce à l'Id que l'on récupère dans la requète
    User.findById(req.params.user_id, function(err, user) {

      if(err) {
        res.send(err);
      }

      else {

        //On va mettre à jour les informations uniquement si nécessaire

        if(req.body.firstName) {
          user.firstName = req.body.firstName;
        }

        if(req.body.lastName) {
          user.lastName = req.body.lastName;
        }

        if(req.body.userName) {
          user.userName = req.body.userName;
        }

        if(req.body.password) {
          user.password = req.body.password;
        }

        //On sauvegarde notre utilisateur dans notre base de donnée

        user.save(function(err) {
          if(err) {
            res.send(err);
          }
          else {
            res.json( {message: 'Utilisateur mis à jour !'});
          }

        })//user.save

      }//fin du else

    })//User.findById

  })//Fin du put

  //On va supprimer un utilisateur dans notre base de donnée (Méthode DELETE sur l'URL http://localhost:8000/api/users/:user_id )
  .delete(function(req, res) {

    //On utilise la méthode remove() de notre model avec comme condition l'Id de l'utilisateur que l'on récupère dans la requête
    User.remove( { _id : req.params.user_id}, function(err) {
      if(err) {
        return res.send(err);
      }
      else {
        res.json({message: 'Utilisateur supprimé avec succès'});
      }
    })
  });//Fin de delete


//D'autres routes pour notre API sont à venir

//On va préfixer toutes nos routes liées à l'API par /api
app.use('/api', apiRouter);

//On lance notre serveur
app.listen(port);
console.log('Notre serveur est en écoute sur le port ' + port);
