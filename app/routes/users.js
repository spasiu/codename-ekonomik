var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var users = require('../repos/users.js')(pg, conString);
var items = require('../repos/Items.js')(pg, conString);
var requests = require('../repos/Requests.js')(pg, conString);

var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 1511022942514049,
    clientSecret: "fa6df13e2141d4fd138c1eb769d005a0",
    callbackURL: "http://localhost:3000/auth/facebook/callback" 
  },
  function(accessToken, refreshToken, profile, done) {
    users.getByFBID({ 'facebook_id': profile.id }, 
      function(user) {
      if (!user) {
        users.newUser({
          name: profile.displayName,
          email: profile.emails[0].value,
          facebook_id: profile._json
        });
      } else if (user) {
        return done(null, user);
      }
      if (err) { return done(err); }
    });
  }
));

module.exports = function(app){

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/', 
                                        failureRedirect: '/' }));

  app.get('/items', function(request, response){
    Items.getAll(function(result){
      response.render('all_items.ejs', {items: result});
    });
  });

  app.get('/', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      response.render('index.ejs');
    }
  });

  app.get('/user/:id/items', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      var userID;
      var pageID = params['id'];
      users.getByFBID(request.user, function(result) {
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
      users.getByFBID(request.user, function(result) {
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
      users.getByFBID(request.user, function(result) {
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
      users.getByFBID(request.user, function(result) {
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
      users.getFBID(request.user, function(result){
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
