var pg = require('pg'), conString = "pg://postgres:password@localhost/ekonomik-db";
var Users = require('./app/repos/Users.js')(pg, conString);
var Items = require('./app/repos/Items.js')(pg, conString);
var Requests = require('./app/repos/Requests.js')(pg, conString);

// var item1 = {
//   description: "This thing sucks and everyone hates it.",
//   owner: "1",
//   name: "Thing 2",
//   image_link: "https://31.media.tumblr.com/ffbc77ec4f4bdfb17338db131513ac76/tumblr_inline_nbx8jmlAKq1qbf000.jpg"
// }

// Items.createItem(item1);

Items.getAll(function(result){
  console.log(result);
})