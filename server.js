var pg = require('pg'),
    ejs = require('ejs'),
    express = require('express');

var app = express();
app.use('view engine', 'ejs');


require('./app/routes.js')(app);

app.listen(port);
console.log('embark at port ' + port);