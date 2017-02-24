//User.js

//Ce fichier va nous permettre de définir notre modèle de post

//Mongoose utilise des Schema pour modéliser les données. Cela permet de définir les types de variables et de structurer les données.
//Ce Schema prend la forme d'un objet JSON

var mongoose = require('mongoose');

//Mongoose nous propose pour cela la méthode Schema() que nous allons stocker dans la variable Schema
var Schema = mongoose.Schema;

var PostSchema   = new Schema({
  userFirstName: String,
  userLastName: String,
  content: String,
  postDate: Date,
  likes: { type: [String], default: []},
  comments: { type: [String], default: []}
});

//Le modèle va nous permettre d'insérer des données dans MongoDB en respectant le schéma précisé et de faire des requêtes dessus
//On va créer notre modèle grâce à la méthode que mongoose met à notre disposition: La méthode model()
module.exports = mongoose.model('Post', PostSchema);
