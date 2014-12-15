var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var items = require('./repos/Items.js')(pg, conString);

module.exports = function(app){

  var userItems = [{name: "Elephant", description: "test description", image_link: "http://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/330px-African_Bush_Elephant.jpg"},
                    {name: "MacDougal", description: "I'm another elephant. Hi!", image_link: "http://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/1280px-Elephas_maximus_%28Bandipur%29.jpg"}]
  // userItems = items.getAllForUserId();

  app.get('/', function(request, response){
    response.render('list_items.ejs', {userItems: userItems, user: "Maximus the Parakeet"});
  });

  app.get('/items', function(request, response){
    response.render('thumb_items.ejs', {userItems: userItems, user: "Maximus the Parakeet"});
  });

};