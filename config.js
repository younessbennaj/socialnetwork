/*Dans le but d'avoir une strucutre pour notre app beaucoup plus modulaire nous permettant d'ajouter ou de supprimer des éléments
plus facilement, nous avons adopter une nouvelle structure pour notre app. Cette nouvelle structure est inspiré des recommandation faites
pour construire une application MEAN stack de façon à être modulable et scalable */

/*/Configuration/*/

/*Nous allons placer dans ce fichier les variables de Configuration*/

module.exports = {
  'port': process.env.PORT || 8000,
  'database': 'mongodb://root:root@waffle.modulusmongo.net:27017/giDyp4yz',
  'secret': 'itrytobuildasocialnetwork'
};
