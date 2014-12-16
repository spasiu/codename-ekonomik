var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var Users = require('../repos/Users.js')(pg, conString);
var Items = require('../repos/Items.js')(pg, conString);
var Requests = require('../repos/Requests.js')(pg, conString);

// var auth = require('../auth.js');

module.exports = function(app){

  app.get('/items', function(request, response){
    Items.getAll(function(result){
      response.render('all_items.ejs', {items: result});
    });
  });

  app.get('/user/:id/items', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      var userID;
      var pageID = params['id'];
      Users.getByFBID(request.user, function(result) {
        userID = result.id;
        Items.getAllForUserId({owner: pageID},function(result){
          response.render('thumb_items.ejs', {items: result, user: {id: pageID}, currentUser: {id: userID}});
        });
      });
    }
  });

  app.get('/requests', function(request, response){
    if (!request.isAuthenticated()) { 
      response.redirect('/auth/facebook');
     } else {
      var userID;
      Users.getByFBID(request.user, function(result) {
        userID = result.id;
        Requests.getByOwnerId({owner_id: userID}, function(ownerRequests){
          Requests.getByBorrowerId({borrower_id: userID}, function(borrowerRequests){
            response.render('requests.ejs', {
              requests: {
                myRequests: ownerRequests, 
                theirRequests: borrowerRequests
              }
            });
          });
        });
      });
     }
  });


  app.post('/requests', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      var userID;
      Users.getByFBID(request.user, function(result) {
        userID = result.id;
        var itemID = params['id'];
        var ownerID = params['owner'];
        Requests.newRequest({
          item_id: itemID,
          borrower_id: userID,
          owner_id: ownerID,
        }, function(){

        });
      });
    }
  });

  app.post('/items', function(request, response){

  });

  app.put('/requests/:id', function(request, response){
    
  });

};