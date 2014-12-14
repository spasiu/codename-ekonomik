module.exports = function(app){
  
  app.get('/', function(request, response){
    response.render('thumb_items.ejs');
  });

};