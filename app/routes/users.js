var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var users = require('../repos/Users.js')(pg, conString);
var items = require('../repos/Items.js')(pg, conString);
var requests = require('../repos/Requests.js')(pg, conString);

var auth = require('./auth.js');

module.exports = function(app){

  var userItems = [{name: "Elephant", description: "test description", image_link: "http://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/330px-African_Bush_Elephant.jpg"},
                    {name: "MacDougal", description: "I'm another elephant. Hi!", image_link: "http://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/1280px-Elephas_maximus_%28Bandipur%29.jpg"}];
  // userItems = items.getAllForUserId();

  var userRequests = [{borrower: "Elphie", item: "hairdryer"},
                      {borrower: "McSnazzie", item: "bedazzled pants"}];

  var borrowed = [{name: "chainsaw", owner: "Gilligan"},
                  {name: "speakers", owner: "Mikintosh"}]

  app.get('/', function(request, response){
    response.render('index.ejs', {userItems: userItems, user: "Maximus the Parakeet"});
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/', 
                                        failureRedirect: '/login' }));

};