
// var pg = require('pg'), conString = "postgres://something";
module.exports = function(pg,conString){
  var createTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        CREATE TABLE IF NOT EXISTS users ( \
          id SERIAL PRIMARY KEY \
          name TEXT, \
          email TEXT, \
          password TEXT \
        );\
      ";

      client.query(queryString, function(err, result){
        done();
        callback(result);
        if(err) return console.log('error running query', err);
      });
    });
  };

  var dropTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "DROP TABLE users;"

      client.query(queryString, function(err, result){
        done();
        callback(result);
        if(err) return console.log('error running query', err);
      });
    });
  };

  var getAllFn = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = " \
        SELECT name, email, id \
        FROM users; \
      ";

      client.query(queryString, function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var newUserFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = " \
        INSERT INTO users (name, email, password) \
        VALUES ($1,$2,$3) \
        RETURNING id; \
      ";

      client.query(queryString, [params.name, params.email, params.password], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var deleteUserFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        DELETE FROM users \
        WHERE id=$1; \
      ";

      client.query(queryString, [params.id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var getByIdFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT * \
        FROM users \
        WHERE id=$1; \
      ";

      client.query(queryString, [params.id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var getByEmailFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT * \
        FROM users \
        WHERE email=$1; \
      ";

      client.query(queryString, [params.email], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  createTable();

  return {
    getById    : getByIdFn,
    getByEmail : getByEmailFn,
    deleteUser : deleteUserFn,
    newUser    : newUserFn,
    getAll     : getAllFn
  }
};
