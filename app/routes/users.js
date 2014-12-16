var pg = require('pg');
var conString = process.env.DATABASE_URL || "pg://postgres:password@localhost/ekonomik-db";
var domain =  process.env.OUR_DOMAIN || "localhost:3000";
var users = require('../repos/Users.js')(pg, conString);
var items = require('../repos/Items.js')(pg, conString);
var requests = require('../repos/Requests.js')(pg, conString);

var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 1511022942514049,
    clientSecret: "fa6df13e2141d4fd138c1eb769d005a0",
    callbackURL: +"/auth/facebook/callback" 
  },
  function(accessToken, refreshToken, profile, done) {
    users.getByFBID({ 'facebook_id': profile.id }, 
      function(user) {
        console.log(user);
      if (user.length == 0) {
        console.log(profile);
        users.newUser({
          name: profile.displayName,
          email: "fake@email.com",
          facebook_id: profile._json.id
        });
      } else if (user) {
        return done(null, user);
      }
    });
  }
));

module.exports = function(app){
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook'), function(request, response) 
      {response.redirect(request.session.returnTo || '/')}
      );

  app.get('/items', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else {
      users.getByFBID(request.user[0], function(result) {
      userID = result[0].id;

      // FB.api(
      //   "/v2.0/"+userID+"/friends?fields=id",
      //   function(result) {
      //     console.log(result.data[0].id)
      //   })

      var pageOwner = result[0];
      items.getAll(function(result){
        response.render('all_items.ejs', {items: result, currentUser: pageOwner});
        });
      });
    }
  });

  app.get('/items/:id', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else { 
      users.getByFBID(request.user[0], function(result) {
        var pageOwner = result[0];
        var itemID = request.params['id'];
        items.getById({id: itemID}, function(result) {
          response.render('item_detail.ejs', {item: result[0], currentUser: pageOwner});
        });
      });
    }
  });

  app.get('/', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else {
      response.render('index.ejs');
    }
  });

  app.get('/user/:id/items', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else {
      var userID;
      var pageID = request.params['id'];
      users.getByFBID(request.user[0], function(result) {
        userID = result[0].id;
        users.getById({id: pageID}, function(result){
          var pageOwner = result[0];
          items.getAllForUserId({owner: pageID},function(result){
            response.render('user_items.ejs', {items: result, user: pageOwner, currentUser: {id: userID}});
          });
        });
      });
    }
  });

  app.get('/youritems', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else {
      var userID;
      users.getByFBID(request.user[0], function(result) {
        userID = result[0].id;
        response.redirect('/user/' + userID + '/items');
      });
    }
  });

  app.get('/requests', function(request, response){
    if (!request.isAuthenticated()) { 
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
     } else {
      var userID;
      users.getByFBID(request.user[0], function(result) {
        userID = result[0].id;
        requests.getByOwnerId({owner_id: userID}, function(ownerRequests){
          requests.getByBorrowerId({borrower_id: userID}, function(borrowerRequests){
            response.render('requests.ejs', {
              myRequests: borrowerRequests, 
              theirRequests: ownerRequests
            });
          });
        });
      });
     }
  });


  app.post('/requests', function(request, response){
    if (!request.isAuthenticated()) {
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    } else {
      var userID;
      users.getByFBID(request.user[0], function(result) {
        userID = result[0].id;
        var itemID = request.body['id'];
        var ownerID = request.body['owner'];
        requests.newRequest({
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
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
    }else{
      var userID;
      users.getByFBID(request.user[0], function(result){
        userID = result[0].id;
        var description = request.body['description'],
        name = request.body['name'],
        image = request.body['image_link'];
        var newItem = {
          description: description, 
          name: name, 
          image_link: image, 
          owner: userID
        };
        items.createItem(newItem, function(){
          response.redirect('/user/' + userID + '/items');
        });
      });
    }
  });

  app.put('/requests/:id', function(request, response){
    if (!request.isAuthenticated()) { 
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
     } else {
      requests.changeRequestStatus({id: request.params.id, status: request.body.status}, function(result){
        response.send(result);
      });
     }
  });

  app.put('/items/:id', function(request, response){
    if (!request.isAuthenticated()) { 
      request.session.returnTo = request.path;
      response.redirect('/auth/facebook');
     } else {
      console.log(request.body);
      items.updateResidesAt({id: request.params.id, resides_at: request.body.resides_at}, function(result){
        response.send(result);
      });
     }
  });

};
