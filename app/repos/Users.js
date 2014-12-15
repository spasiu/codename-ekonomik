
// var pg = require('pg'), conString = "postgres://something";
module.exports = function(pg,conString){

  var dbQuery = function(callback, queryString, array){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      client.query(queryString, array, function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        if (callback) callback(result.rows);
        return;
      });
    });
  };

  var createTableFn = function(callback){
    var queryString = "\
      CREATE TABLE IF NOT EXISTS users ( \
        id SERIAL PRIMARY KEY, \
        name TEXT, \
        email TEXT, \
        password TEXT \
      );\
    ";
    dbQuery(callback, queryString, []);
  };

  var dropTableFn = function(callback){
    var queryString = "DROP TABLE users;"
    dbQuery(callback, queryString, []);
  };

  var getAllFn = function(callback){
    var queryString = " \
      SELECT name, email, id \
      FROM users; \
    ";
    dbQuery(callback, queryString, []);
  };

  var newUserFn =  function(params, callback){
    var queryString = " \
      INSERT INTO users (name, email, password) \
      VALUES ($1,$2,$3) \
      RETURNING id; \
    ";
    dbQuery(callback, queryString, [params.name, params.email, params.password]);
  }

  var deleteUserFn = function(params, callback){
    var queryString = "\
      DELETE FROM users \
      WHERE id=$1; \
    ";
    dbQuery(callback, queryString, [params.id]);
  };

  var getByIdFn = function(params, callback){
    var queryString = "\
      SELECT * \
      FROM users \
      WHERE id=$1; \
    ";
    dbQuery(callback, queryString, [params.id]);
  }

  var getByEmailFn = function(params, callback){
    var queryString = "\
      SELECT * \
      FROM users \
      WHERE email=$1; \
    ";
    dbQuery(callback, queryString, [params.email]);
  };

  createTableFn();

  return {
    getById     : getByIdFn,
    getByEmail  : getByEmailFn,
    deleteUser  : deleteUserFn,
    newUser     : newUserFn,
    getAll      : getAllFn,
    createTable : createTableFn,
    dropTable   : dropTableFn
  }
};
