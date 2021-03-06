/*Nous allons nous attaquer à la première grande partie de ce projet: Construire l'API Restful qui va être utilisée par notre application.

1 - app/
2 ----- models/
3 ---------- user.js // Notre modèle
4 - node_modules/ // Créer par npm
5 - package.json //où on va déclarer nos dépendances
6 - server.js // Configures nos application et va créer nos routes*/

/*Web tokens : les clés d'authentification API peuvent donc servir à limiter le contrôle ou à protéger les mots de passe de l'utilisateur.
Le but principal lorsque l'on utilise des tokens c'est que l'on a besoin de s'authentifier que la première fois avec notre username et notre
password, ensuite pour chaque requêtes que nous ferons nous aurons seulement besoin de ce tokens. Le serveur n'a pas besoin de créer une session
et stocker les informations de l'utilisateurs.
L'autre intérêt d'utilisation des tokens est la creation de permition différentes, par exemple certains utilisateurs auront accès à nos données mais
n'auront accès qu'au informations que l'on aura défini.*/

/*/Nous allons créer une nouvelle route dans notre API. Accessible via la methode POST sur l'URL http://localhost:8000/api/authenticate. Cet
a cet endroit que notre utilisateur va pouvoir envoyer via une méthode POST son nom d'utilisateur ainsi que son mot de passe et en échange il va
recevoir un jeton lui permettant d'accéder aux informations de notre API./*/

/*Qu'est ce qu'un jsonwebtoken ?*/

/*C'est un moyen de transmettre de façon sécurisé des informations entre deux parties sous la forme d'un objet JSON. Il peut être utilisé dans deux cas:
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

/* Maintenant que nous avons fournis un token à notre utilisateur il va pouvoir être stocké coté client (probablement au mooyen d'un cookie). Ce jeton va
nous être envoyé à chaque requête uù l'utilisateur voudra récupérer des informations. Lorsqu'un client possède un token il va pouvoir alors identifer
l'utilisateur. Le token peut être envoyer dans un cookie ou dans un header http. Peu importe le moyen avec lequel il va être envoyer, le token reste
cette même chaine de caractère compactée que l'on a envoyer au client. Pour vérifier si ce token est correcte on va utiliser la methode verify() de
l'objet jwt avec en argument notre token et la variable secrete. Si le token est valide, cette méthode va retourner un json qui contient les informations
que l'on a plancé de le jsonwebtoken. Si il n'est pas valide cette méthode va retrouner une erreure qui décrit ce problème. On va utiliser notre
route middleware pour protéger notre route API, c'est à dire que nous allons vérifier le token pour chaque requête sur nos routes authentifiées. Nous
allons permettre à notre utilisateur de fournir le token via les paramètres POST, les paramètres de l'URL ou via un header HTTP. */

/*Edit Structure Fichier: Dans le but d'avoir une strucutre pour notre app beaucoup plus modulaire nous permettant d'ajouter ou de supprimer des éléments
plus facilement, nous avons adopter une nouvelle structure pour notre app. Cette nouvelle structure est inspiré des recommandation faites
pour construire une application MEAN stack de façon à être modulable et scalable.*/

/*Jusqu'à répsent nous avons créer notre Node API et nous avons utilisé les JSON web tokens pour permettre l'authentification sur notre API. Pour notre
projet l'objectif est d'avoir une véritable séparation entre le code coté back end et le code front end. Notre but maintenant est de constuire une
application Angular sans avoir à éditer le coté serveur (du moins pour l'instant dans l'objectif de créer la base de notre application MEAN stack
modulable et scalable). Nous allons donc construire notre application en simulant l'utilision d'une API extérieure différente de la notre maintenu
par quelqu'un d'autre afin de permettre à notre application d'être entièrement modulable. La première partie de notre application sur laquelle nous allons
nous plancher est l'authentification. */

/*Séparé le coté serveur du coté client comme nous voulons le faire implique qu'il existe un élément qui doit faire le lien entre les deux. Dans le
cadre d'une application MEAN stack utilisant une API et l'utilisation d'Angular, ce sont les services qui font le liens entre les deux. Nos services
vont s'occuper de contacter notre API, de récupérer les données et de les fournir à nos controller qui détiennent la logique de notre application. Nous
allons également utiliser pour cela le service $http de angular pour faire des requêtes http à notre API.*/

/*Authentification*/

/*Nous allons donc créer un service authenticateService afin d'authentifier notre utilisateur.*/

/*La particularité c'est que chaque post offre la possibilité de customisé son post (espace commentaire ou non, like ou non, etc).*/
