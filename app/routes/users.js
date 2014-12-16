var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var users = require('../repos/Users.js')(pg, conString);
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

  app.get('/', function(request, response){
    if (!request.isAuthenticated()) {
      response.redirect('/auth/facebook');
    } else {
      console.log(request.user)
      response.render('index.ejs', {userItems: userItems, user: "Maximus the Parakeet"});
    }
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/', 
                                        failureRedirect: '/' }));
};
