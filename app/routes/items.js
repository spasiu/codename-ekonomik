var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var Users = require('../repos/Users.js')(pg, conString);
var Items = require('../repos/Items.js')(pg, conString);
var Requests = require('../repos/Requests.js')(pg, conString);

// var auth = require('../auth.js');

module.exports = function(app){

  app.get('/items', function(request, response){
    Items.getAll(function(result){
      response.render('list_items.ejs', {items: result});
    });
  });

  // app.get('/requests', function(request, response){
  //   response.render('requests.ejs', {userRequests: userRequests, borrowed: borrowed});
  // });

  // app.get('/items/new', function(request, response){
  //     response.render('new_item_page.ejs');
  // });

  // app.post('/items/new', function(request, response){
  //     // bodyParser middleware?
  // });

  

};