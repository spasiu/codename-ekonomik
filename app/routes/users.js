var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var users = require('../repos/Users.js')(pg, conString);
var items = require('../repos/Items.js')(pg, conString);
var requests = require('../repos/Requests.js')(pg, conString);

// var passport = require('../auth.js');

var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

users.findOrCreate = function (id, callback) {
  console.log(id);
<<<<<<< HEAD
  console.log(users.getByFBID(id));
  return callback("User not authenticated", this.getByFBID(id));
};
=======
  console.log(users.getByFBID(id))
  return callback("User not authenticated", this.getByFBID(id))
}
>>>>>>> 672f6293c2a3704df1c65546f535465f07b6008f

passport.use(new FacebookStrategy({
    clientID: 1511022942514049,
    clientSecret: "fa6df13e2141d4fd138c1eb769d005a0",
    callbackURL: "http://localhost:3000/auth/facebook/callback" 
  },
  function(accessToken, refreshToken, profile, done) {
    users.findOrCreate({ 'facebook_id': profile.id }, 
      function(err, user) {
        // console.log(user)
      if (!user) {
        user = users.newUser({
          name: profile.displayName,
          // email: profile.emails[0].value,
          email: "fake_email@email.com",
          facebook: profile._json
        });
      } else if (user) {
        return done(null, user);
      }
      if (err) { return done(err); }
    });
  }
));

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
                                        failureRedirect: '/' }));
};