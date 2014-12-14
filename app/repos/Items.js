
// var pg = require('pg'), conString = "postgres://something";
module.exports = function(pg){
  var createTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        CREATE TABLE IF NOT EXISTS items (\
          id SERIAL PRIMARY KEY\
          description TEXT,\
          owner INTEGER REFERENCES users (id) ON DELETE CASCADE,\
          name TEXT,\
          image_link TEXT\
        );\
      ";

      client.query(queryString, ['1'], function(err, result){
        done();
        callback(result);
        if(err) return console.log('error running query', err);
      });
    });
  };

  var dropTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "DROP TABLE items;"

      client.query(queryString, ['1'], function(err, result){
        done();
        callback(result);
        if(err) return console.log('error running query', err);
      });
    });
  };

  var getAllFn = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT *\
        FROM items;\
      ";

      client.query(queryString, ['1'], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var createItemFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        INSERT INTO items (description, owner, name, image_link)\
        VALUES ($1,$2,$3,$4)\
        RETURNING id;\
      ";

      client.query(queryString, [params.description, params.owner, params.name, params.image_link], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var deleteItemFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        DELETE FROM items\
        WHERE id=$1;\
      ";

      client.query(queryString, [params.id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var getAllForUserIdFn = function(userId, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT *\
        FROM items\
        WHERE owner=$1;\
      ";

      client.query(queryString, [userId], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  createTable();

  return {
    getAllForUserId : getAllForUserIdFn,
    deleteItem      : deleteItemFn,
    createItem      : createItemFn,
    getAll          : getAllFn
  }
};
