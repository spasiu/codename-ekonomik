var pg = require('pg'), conString = "postgres://localhost/ekonomik-db";
var items = require('repos/Items.js')(pg);

module.exports = function(app){
  items.
  app.get('/', function(request, response){
    response.render('list_items.ejs');
  });

};