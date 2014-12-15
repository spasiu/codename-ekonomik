module.exports = function(pg){
  var users = require('./repos/Users.js')(pg);
  var auth = function(email, password){
    users.getByEmail(email, function(userInfo){
      if(userInfo){
        
      }else{
        return {message: "No such user", login: false}
      }
    });
  };
  

};

