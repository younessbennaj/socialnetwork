var User = require('../models/user');
//On va mainteant importer notre modèle pour pouvoir l'utiliser dans notre application (app/models/user.js)
var jwt = require('jsonwebtoken');
//On va faire appel au module jsonwebtoken
var config = require('../../config');
//On va faire appel à nos configuration présentent dans le fichier config.js

var mySecret = config.secret;
/* Cette variable est ce que l'on appel le secret dans le procesus du webtokens. C'est la signature que va detenir le serveur pour savoir si ce
webtokens a bien été émis par lui et il va utiliser cette variable à chaque fois qu'il va générer un nouveau jeton. */

module.exports = function(app, express) {

  /*Grâce à l'utilisation de la méthode Router() on va pouvoir être en mesure de sectionner notre site. On va par exemple pouvoir créer une instance
  basicRouter pour gérer les routes de notre front-end par exemple et une autre instance apiRouter pour gérer celle qui sont lié à notre API. Une va
  également pouvoir créer une instance adminRouter qui va nous permettre de gérer les routes lié au profil administrateur et qui vont être protégé
  par une authentification. Utiliser ce principe de routage va nous permettre de compartementer notre application et nous donner la flexibilité dont
  nous avons besoin dans la construction d'une application complèxe. */


  /*l'objet Router() comporte toutes les méthodes d'un objet de type express, dans notre cas nous allons utiliser principalement sa méthode Route()
  qui va nous permettre de gérer les requêtes qui nous sont faites.*/
  var apiRouter = express.Router();

  //On va créer un user (methode POST sur l'URL http://localhost:8000/api/users)
  apiRouter.post('/users', function(req, res) {
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
  }); //fin de la méthode post

  /*/Authenticate/*/

  /*jsonwebtoken ? C'est un moyen de transmettre de façon sécurisé des informations entre deux parties sous la forme d'un objet JSON. Il peut être utilisé dans deux cas:
  L'authentification ou l'échange d'information. Dans notre cas (et c'est le cas le plus souvent) il est utilisé pour l'authentification. C'est à dire
  qu'une fois que l'utilisateur est logger, chaque requête transmise au serveur contiendra ce jsonwebtoken, permettant ainsi à l'utilisateur l'accès
  aux routes, services et ressources dont l'accès est permis seulement par ce token (jeton). La structure d'un jsonwebtoken est composé de 3 parties séparé
  par un point (aaaaaa.bbbbbb.cccccc): Header, payload et signature. Le header est composé du type de token et de l'algorithme de hashage utilisé. Le
  Payload contient les informations à propos d'une entité (dans notre cas l'utilisateur) et des metadata addiditionnelle (par exemple le temps au bout
  du quel le jeton expire). La signature est ce qui va permettre de sécurisé notre jsonwebtoken, c'est un procesus que va prendre en charge notre package
  jwt et qui va utiliser l'encodage de notre header et de notre payload ainsi la variable secrete que nous avons définis. Le resultat de tout ça est
  une chaine de caractère encoder en base64 (utilisant 64 caractères).
  ex: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImNocmlzbWFydGluIiwiZmlyc3ROYW1lIjoiQ2hyaXMiLCJsYXN0TmFtZSI6Ik1hcnRpbiIsImlhdCI6MTQ4NTI1MjQyNywiZ
  XhwIjoxNDg1MjUyNDI3fQ.hNaYjpwShI5rrVMiHjf3pP0utV014weyKmepprYaLPY'*/

  // Route pour authentifier un utilisisateur  (Méthode POST sur l'URL http://localhost:8000/api/authenticate)
  /*maj: Nous avons sortie cette route des routes protégées car nous voulons permettre à n'importe quel utilisateur de créer un compte sans
  qu'il n'ai à posséder de token.*/

  apiRouter.post('/authenticate', function(req, res) {

    //On va récupérer notre utilisateur
    //Nous allons utiliser notre Model 'User' qui est un accès direct à la collection 'users'
    //Pour récupérer notre utilisateur nous avons le choix entre find, findOne et findById.
    //En résumer: Pour chaque utilisateur dont l'userName match avec celui de la requête, on va selectionner les champs firstName, lastName, userName et password
    /*Comme nous n'avons pas passer de callback à la méthode findOne() il faudra appeler la méthode exec() de l'objet Query que nous retourne la methode
    findOne() afin de l'exececuter et de récupérer les résultats.*/

    var query = User.findOne({userName: req.body.userName});

    query.select('firstName lastName userName password');

    query.exec(function(err, user) {
      if(err) {
        res.send(err);
      }
      else {
        //Aucun utilisateur ne correspond à celui fournis dans la requête
        if(!user) {
          res.json({
            success: false,
            message: 'authentification impossible. Cet utilisateur n\'existe pas'
          });
        } //fin de if(!user)
        else {
          //On va gérer le cas où l'utilisateur existe mais que le mot de passe n'est pas le bon
          if(user.password !== req.body.password) {
            res.json({
              success: false,
              message: 'Authentification impossible. Le mot de passe n\'est pas correct !'
            });
          }
          else {

            //Si l'utilisateur existe et que le mot de passe est le bon on va donc créer un jeton pour notre utilisateur

            /*On va utiliser pour cela le jsonwebtoken package pour signer ce jeton. Ce package va générer automatiquement le header et la signature
            de notre jsonwebtoken après qu'on lui ai passé en argument notre payload qui est dans notre cas notre utilisateur.*/

            var token = jwt.sign({
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  _id: user._id
                }, mySecret,
                  { expiresIn: '24h' } //Expire au bout de 24h, une nouvelle authentification sera nécessaire
                );

            res.json({
              success: true,
              message: 'l\'authentification est un succes !',
              token: token
            });

          }//Fin du else

        }
      }
    });
  }); //Fin de la méthode POST sur la route /authenticate

  /*/Le middleware qui protège nos routes authentifiées/*/

  /* Maintenant que nous avons fournis un token à notre utilisateur il va pouvoir être stocké coté client (probablement au mooyen d'un cookie). Ce jeton va
  nous être envoyé à chaque requête uù l'utilisateur voudra récupérer des informations. Lorsqu'un client possède un token il va pouvoir alors identifer
  l'utilisateur. Le token peut être envoyer dans un cookie ou dans un header http. Peu importe le moyen avec lequel il va être envoyer, le token reste
  cette même chaine de caractère compactée que l'on a envoyer au client. Pour vérifier si ce token est correcte on va utiliser la methode verify() de
  l'objet jwt avec en argument notre token et la variable secrete. Si le token est valide, cette méthode va retourner un json qui contient les informations
  que l'on a plancé de le jsonwebtoken. Si il n'est pas valide cette méthode va retrouner une erreure qui décrit ce problème. On va utiliser notre
  route middleware pour protéger notre route API, c'est à dire que nous allons vérifier le token pour chaque requête sur nos routes authentifiées. Nous
  allons permettre à notre utilisateur de fournir le token via les paramètres POST, les paramètres de l'URL ou via un header HTTP. */

  //Déclaration du middleware qui va vérifier notre token

  apiRouter.use('/', function(req, res, next) {

    //On va récupérer notre token selon l'une des 3 manières dont l'utilisateur peut nous le passer
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //Si on récupère un token
    if(token) {

      //On va utiliser la méthode verify() pour vérifier si ce token est valide
      /* La fonction de callback va nous permettre de récupérer le payload de notre token une fois qu'il est décodé si la signature passé en argument
      est valide. Sinon il retourne une erreur.*/
      jwt.verify(token, mySecret, function(err, decoded) {
        if(err) {
          //On va envoyer une réponse http avec le code 403 (accès refusé) et un message d'erreur
          return res.status(403).send({
            success: false,
            message: 'Echec à authentifier le token'
          });
        } //Fin de if(err)
        else {
          //Si la signature passé en argument est correcte on va pouvoir aller à la prochaine route
          //On va stocker notre payload (les informations) décoder dans la requête pour être utiliser dans les prochaines routes

          req.decoded = decoded;

          //L'utilisateur peut aller plus loin seulement si il fournis un token et que celui ci est vérifié
          next();

        } //Fin du else

      }); //Fin de la méthode verify()
    } // Fin de if(token)
    else {
      //S'il n'y a pas de token envoyer par l'utilisateur
      //On va envoyer une réponse http avec le code 403 (accès refusé) et un message d'erreur
      return res.status(403).send({
        success: false,
        message: 'Aucun token fournis.'
      });
    }//Fin du else

  //Nous avons donc construit notre middleware qui va protéger l'accés aux routes qui suivent et qui sont accéssible seulement si on est identifié
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
    }) //fin de la méthode post

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

  /* Permet de récupérer les informations de l'utilisateur qui est loggé grâce aux informations récupéré dans le payload du webtoken et stocké dans
  la requête */

  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;

};
