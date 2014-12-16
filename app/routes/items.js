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
        userID = result[0].id;
        Items.getAllForUserId({owner: pageID},function(result){
          response.render('user_items.ejs', {items: result, user: {id: pageID}, currentUser: {id: userID}});
        });
      });
    }
  });

  app.get('/youritems', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      var userID;
      Users.getByFBID(request.user, function(result) {
        userID = result[0].id;
        response.redirect('/user/' + userID + '/items');
      });
    }
  });

  app.get('/requests', function(request, response){
    if (!request.isAuthenticated()) { 
      response.redirect('/auth/facebook');
     } else {
      var userID;
      Users.getByFBID(request.user, function(result) {
        userID = result[0].id;
        Requests.getByOwnerId({owner_id: userID}, function(ownerRequests){
          Requests.getByBorrowerId({borrower_id: userID}, function(borrowerRequests){
            response.render('requests.ejs', {
              myRequests: ownerRequests, 
              theirRequests: borrowerRequests
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
        userID = result[0].id;
        var itemID = params['id'];
        var ownerID = params['owner'];
        Requests.newRequest({
          item_id: itemID,
          borrower_id: userID,
          owner_id: ownerID,
        }, function(result){
          response.send(result);
        });
      });
    }
  });

  app.post('/items', function(request, response){
        if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    }else{
      var userID;
      Users.getFBID(request.user, function(result){
        userID = result[0].id;
        var description = params['description'],
        name = params['name'],
        image = params['image'],
        newItem = {
          description: description, 
          name: name, 
          image_link: image, 
          owner: userID
        };
        Items.createItem(newItem, function(){
          response.redirect('/items');
        });
      });
    }
  });

  app.put('/requests/:id', function(request, response){
    if (!request.isAuthenticated()) { 
      response.redirect('/auth/facebook');
     } else {
      Requests.changeRequestStatus({id: params.id, status: params.status}, function(result){
        response.send(result);
      });
     }
  });

};