
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
      CREATE TABLE IF NOT EXISTS requests ( \
        id SERIAL PRIMARY KEY, \
        item_id INTEGER REFERENCES items (id) ON DELETE CASCADE, \
        owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE, \
        borrower_id INTEGER REFERENCES users (id) ON DELETE CASCADE, \
        status TEXT \
      );\
    ";
    dbQuery(callback, queryString, []);
  };

  var dropTableFn = function(callback){
    var queryString = "DROP TABLE requests;"
    dbQuery(callback, queryString, []);
  };

  var newRequestFn = function(params, callback){
    var queryString = "\
      INSERT INTO requests (item_id, owner_id, borrower_id, status) \
      VALUES ($1,$2,$3,$4) \
      RETURNING id; \
    ";
    dbQuery(callback, queryString, [params.item_id, params.owner_id, params.borrower_id, "requested"]);
  };

  var changeRequestStatusFn = function(params, callback){
    var queryString = "\
      UPDATE requests \
      SET status=$2 \
      WHERE id=$1 \
      RETURNING id; \
    ";
    dbQuery(callback, queryString, [params.id, params.status]);
  };

  var deleteRequestFn = function(params, callback){
    var queryString = "\
      DELETE FROM requests \
      WHERE id=$1; \
    ";
    dbQuery(callback, queryString, [params.id]);
  };

  var getByRequestIdFn = function(params, callback){
    var queryString = "\
      SELECT requests.id, requests.status, requests.owner_id, requests.item_id, requests.borrower_id, \
        items.description, items.name, items.resides_at, items.image_link \
      FROM requests \
      INNER JOIN items \
      ON requests.item_id = items.id \
      WHERE requests.id=$1; \
    ";
    dbQuery(callback, queryString, [params.id]);
  };

  var getByOwnerIdFn = function(params, callback){
    var queryString = "\
      SELECT requests.id, requests.status, requests.owner_id, requests.item_id, requests.borrower_id, \
        items.description, items.name, items.resides_at, items.image_link, \
        users.name, users.email \
      FROM requests \
      INNER JOIN items \
      ON requests.item_id = items.id \
      INNER JOIN users \
      ON requests.borrower_id = users.id \
      WHERE requests.owner_id=$1; \
    ";
    dbQuery(callback, queryString, [params.owner_id]);
  };

  var getByBorrowerIdFn = function(params, callback){
    var queryString = "\
      SELECT requests.id, requests.status, requests.owner_id, requests.item_id, requests.borrower_id, \
        items.description, items.name, items.resides_at, items.image_link, \
        users.name, users.email \
      FROM requests \
      INNER JOIN items \
      ON requests.item_id = items.id \
      INNER JOIN users \
      ON requests.owner_id = users.id \
      WHERE requests.borrower_id=$1; \
    ";
    dbQuery(callback, queryString, [params.borrower_id]);
  };

  createTableFn();

  return {
    newRequest          : newRequestFn,
    changeRequestStatus : changeRequestStatusFn,
    deleteRequest       : deleteRequestFn,
    getByRequestId      : getByRequestIdFn,
    getByOwnerId        : getByOwnerIdFn,
    getByBorrowerId     : getByBorrowerIdFn,
    createTable         : createTableFn,
    dropTable           : dropTableFn
  }
};
