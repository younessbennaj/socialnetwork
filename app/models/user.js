//User.js

//Ce fichier va nous permettre de définir notre modèle

//Mongoose utilise des Schema pour modéliser les données. Cela permet de définir les types de variables et de structurer les données.
//Ce Schema prend la forme d'un objet JSON

var mongoose = require('mongoose');

//Mongoose nous propose pour cela la méthode Schema() que nous allons stocker dans la variable Schema
var Schema = mongoose.Schema;

//va nous permettre de hasher les mots de passe pour plus de sécurité
var bcrypt = require('bcrypt-nodejs')

//On va affecter à chaque propriété le type de champ attendu
var UserSchema   = new Schema({
    firstName: String,
    lastName: String,
    userName:  {type: String, required: true, index: { unique: true }}, //Permet d'avoir qu'un seul userName et evite les doublons dans la BD
    password: { type: String, required: true, select: false } //Permet de ne pas envoyer le mot de passe lors de la methode get afin de maximiser la sécurité
});
//Notre schema va nous permettre ensuite de pouvoir créer un modèle
//Le modèle va nous permettre d'insérer des données dans MongoDB en respectant le schéma précisé et de faire des requêtes dessus
//On va créer notre modèle grâce à la méthode que mongoose met à notre disposition: La méthode model()
module.exports = mongoose.model('User', UserSchema);


//Maintenant que ce fichier est crée nous allons pouvoir l'exporter vers notre fichier server.js pour pouvoir l'utiliser dans notre application
