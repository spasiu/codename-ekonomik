var ejs = require('ejs'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    passport = require('passport'),
    port = process.env.PORT || 3000,
    livereload = require('express-livereload');

livereload(app, config={});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var app = express();

app.use(express.static('public'));
app.use(cookieParser());
// app.use(express.bodyParser());
app.use(expressSession({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);

app.set('view engine', 'ejs');


// require('./app/routes/items.js')(app);
require('./app/routes/users.js')(app);


app.listen(port);
console.log('embark at port ' + port);