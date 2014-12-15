var pg = require('pg'), conString = "postgres://postgres:password@localhost/ekonomik-test-db";
// var Items = require('../app/repos/Items.js')(pg,conString);
var Requests = require('../app/repos/Requests.js')(pg,conString);

// console.log(Users);




var request = {
  id: 1,
  status: "loaned"
}

Requests.changeRequestStatus(request, function(result){
  Requests.getByOwnerId({owner_id:3}, function(result){
    console.log(result);
  });
});

// var item = {
//   description: "Good item",
//   owner: "4",
//   name: "Stick",
//   image_link: "http://google.com"
// }

// Items.getAllForUserId({owner:3}, function(){
//   Items.getAll(function(result){
//     console.log(result);
//   });
// });



// var user = {name: "Sean", email: "sgibat@gmail.com", password:"password"};

// Users.getByEmail({email:"sgibat@gmail.com"}, function(result){
//     console.log('hey');
//     console.log(result);
//     // done();
//   });


// describe("Items", function() {
//   beforeEach(function(done){
//     Users.createTable(function(){
//       console.log('hi');
//       done();
//     });
//   });

//   it("should be able to create a new User", function(done){
//     var user = {name: "Sean", email: "sgibat@gmail.com", password:"password"};
//     Users.newUser(user, function(){ 
//       Users.getAll(function(result){
//         console.log(hey);
//         console.log(result.length);
//         done();
//       });
//     });
//   });

// });