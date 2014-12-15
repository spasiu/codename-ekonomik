var ejs = require('ejs'),
    express = require('express'),
    expressSession = require('express-session'),
    passport = require('passport'),
    port = process.env.PORT || 3000;

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


require('./app/routes/items.js')(app);
require('./app/routes/users.js')(app);


app.listen(port);
console.log('embark at port ' + port);