//Server.js

/*Edit Structure Fichier: Dans le but d'avoir une strucutre pour notre app beaucoup plus modulaire nous permettant d'ajouter ou de supprimer des éléments
plus facilement, nous avons adopter une nouvelle structure pour notre app. Cette nouvelle structure est inspiré des recommandation faites
pour construire une application MEAN stack de façon à être modulable et scalable. Le code de base n'as pas cette structure.*/

//Notre application va faire appel au module express ainsi qu'à ses fonctionnalités
var express = require('express');
//body-parser va extraire la portion entière du body de notre request et va l'exposer via la propriété req.body
var bodyParser = require('body-parser');
//Mongoose est un module Node.js, il va servir de passerelle entre notre serveur Node.js et notre serveur MongoDB.
var mongoose = require('mongoose');
//On défini le port d'écoute
var morgan = require('morgan');
//Morgan va nous permettre de logger toutes les requêtes dans la console afin de comprendre ce qu'il se passe
// var jwt = require('jsonwebtoken');
//On va faire appel au module jsonwebtoken
var config = require('./config');
//On va faire appel à nos configuration présentent dans le fichier config.js
var path = require('path');
var port = config.port;
//On défini notre app en utilisant express

var app = express();

// var mySecret = config.secret;
/* Cette variable est ce que l'on appel le secret dans le procesus du webtokens. C'est la signature que va detenir le serveur pour savoir si ce
webtokens a bien été émis par lui et il va utiliser cette variable à chaque fois qu'il va générer un nouveau jeton. */

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
mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

//Les routes//

// Routes pour notre API //

//On va faire appel au module qui contient nos routes dans le fichier app/routes/api.js
var apiRoutes = require('./app/routes/api')(app, express);

//On va préfixer toutes nos routes liées à l'API par /api
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
  res.sendfile(path.join(__dirname + '/public/app/views/index.html'));
});


//On lance notre serveur
app.listen(port);
console.log('Notre serveur est en écoute sur le port ' + port);
