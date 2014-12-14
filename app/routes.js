//passport authentication example
// app.post('/login', passport.authenticate('local', { 
//   successRedirect: '/',
//   failureRedirect: '/login' 
// }));


module.exports = function(app){
  
  app.get('/', function(request, response){
    response.render('index.ejs');
  });

};