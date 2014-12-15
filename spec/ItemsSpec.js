var pg = require('pg'), conString = "postgres://postgres:password@localhost/ekonomik-test-db";
var Items = require('../app/repos/Items.js')(pg,conString);
var Users = require('../app/repos/Users.js')(pg,conString);

// console.log(Users);

Users.createTable(function(){
  console.log('hi');
  Users.newUser({name: "Sean", email: "sgibat@gmail.com", password:"password"}, function(){ console.log('hi2'); });
});

describe("Items", function() {

  it("should be able to create a new User", function(done){
  });

});