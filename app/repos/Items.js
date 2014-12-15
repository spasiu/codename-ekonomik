// var pg = require('pg'), conString = "postgres://something";
module.exports = function(pg,conString){
  var createTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        CREATE TABLE IF NOT EXISTS items ( \
          id SERIAL PRIMARY KEY \
          description TEXT, \
          owner INTEGER REFERENCES users (id) ON DELETE CASCADE, \
          resides_at INTEGER REFERENCES users (id) ON DELETE CASCADE, \
          name TEXT, \
          image_link TEXT \
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
      var queryString = "DROP TABLE items;"

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
      var queryString = "\
        SELECT * \
        FROM items; \
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

  var createItemFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        INSERT INTO items (description, owner, resides_at, name, image_link) \
        VALUES ($1,$2,$2,$3,$4) \
        RETURNING id; \
      ";

      client.query(queryString, [params.description, params.owner, params.name, params.image_link], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var deleteItemFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        DELETE FROM items \
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

  var getAllForUserIdFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT * \
        FROM items \
        WHERE owner=$1; \
      ";

      client.query(queryString, [params.owner], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        result.rows = (result.rows.length > 0) ? result.rows : null;
        callback(result.rows);
        return;
      });
    }); 
  };

  var updateResidesAtFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        UPDATE items * \
        SET resides_at=$1 \
        WHERE id=$2; \
      ";

      client.query(queryString, [params.resides_at, params.id], function(err, result){
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
    getAllForUserId : getAllForUserIdFn,
    updateResidesAt : updateResidesAtFn,
    deleteItem      : deleteItemFn,
    createItem      : createItemFn,
    getAll          : getAllFn
  }
};
