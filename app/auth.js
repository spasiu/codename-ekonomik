module.exports = function(pg, conString){
  var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(new FacebookStrategy({
      clientID: 1511022942514049,
      clientSecret: "fa6df13e2141d4fd138c1eb769d005a0",
      callbackURL: "http://localhost:3000/auth/facebook/callback" // Note: For security reasons, the redirection URL must reside on the same host that is registered with Facebook.
    },
    function(accessToken, refreshToken, profile, done) {
      users.findOrCreate({ 'facebook.id': profile.id }, 
        function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            facbook: profile._json
          });
          users.newUser(user);
        } else {
          return done(err, user);
        }
      });
    }
  ));
  return { passport: passport };
};