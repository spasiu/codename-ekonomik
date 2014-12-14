var pg = require('pg'),
    ejs = require('ejs'),
    express = require('express'),
    port = process.env.PORT || 8080;
    
var app = express();
app.set('view engine', 'ejs');


require('./app/routes.js')(app);

app.listen(port);
console.log('embark at port ' + port);