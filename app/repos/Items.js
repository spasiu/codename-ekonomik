// var pg = require('pg'), conString = "postgres://postgres:password@localhost/ekonomik-test-db";
module.exports = function(pg,conString){

  var dbQuery = function(callback, queryString, array){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      client.query(queryString, array, function(err, result){
        done();
        if(err) return console.log('error running query', err);
        if (callback) callback(result.rows);
        return;
      });
    });
  };

  var createTableFn = function(callback){
    var queryString = "\
      CREATE TABLE IF NOT EXISTS items ( \
        id SERIAL PRIMARY KEY, \
        description TEXT, \
        owner INTEGER REFERENCES users (id) ON DELETE CASCADE, \
        resides_at INTEGER REFERENCES users (id) ON DELETE CASCADE, \
        name TEXT, \
        image_link TEXT \
      );\
    ";
    dbQuery(callback, queryString, []);
  };

  var dropTableFn = function(callback){
    var queryString = "DROP TABLE items;";
    dbQuery(callback, queryString, []);
  };

  var getAllFn = function(callback){
    var queryString = "\
      SELECT items.id, items.description, items.owner, items.resides_at, items.name, items.image_link, \
        users.name AS owner_name \
      FROM items \
      INNER JOIN users \
      ON users.id = items.owner; \
    ";
    dbQuery(callback, queryString, []);
  };

  var createItemFn = function(params, callback){
    var queryString = "\
      INSERT INTO items (description, owner, resides_at, name, image_link) \
      VALUES ($1,$2,$2,$3,$4) \
      RETURNING id; \
    ";
    dbQuery(callback, queryString, [params.description, params.owner, params.name, params.image_link]);
  };

  var deleteItemFn = function(params, callback){
    var queryString = "\
      DELETE FROM items \
      WHERE id=$1; \
    ";
    dbQuery(callback, queryString, [params.id]);
  };

  var getAllForUserIdFn = function(params, callback){
    var queryString = "\
      SELECT items.id, items.description, items.name, items.resides_at, items.image_link, items.owner, \
      users.name AS resides_at_name \
      FROM items \
      INNER JOIN users \
      ON items.resides_at=users.id \
      WHERE owner=$1; \
    ";
    dbQuery(callback, queryString, [params.owner]);
  };

  var updateResidesAtFn = function(params, callback){
    var queryString = "\
      UPDATE items * \
      SET resides_at=$1 \
      WHERE id=$2; \
    ";
    dbQuery(callback, queryString, [params.resides_at, params.id]);
  }

  createTableFn();

  return {
    getAllForUserId : getAllForUserIdFn,
    updateResidesAt : updateResidesAtFn,
    deleteItem      : deleteItemFn,
    createItem      : createItemFn,
    getAll          : getAllFn,
    dropTable       : dropTableFn,
    createTable     : createTableFn
  }
};
