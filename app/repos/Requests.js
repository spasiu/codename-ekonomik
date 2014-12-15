
// var pg = require('pg'), conString = "postgres://something";
module.exports = function(pg,conString){
  var createTable = function(callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        CREATE TABLE IF NOT EXISTS requests (\
          id SERIAL PRIMARY KEY,\
          item_id INTEGER REFERENCES items (id) ON DELETE CASCADE,\
          owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE,\
          borrower_id INTEGER REFERENCES users (id) ON DELETE CASCADE,\
          status TEXT\
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
      var queryString = "DROP TABLE requests;"

      client.query(queryString, function(err, result){
        done();
        callback(result);
        if(err) return console.log('error running query', err);
      });
    });
  };

  var newRequestFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        INSERT INTO requests (item_id, owner_id, borrower_id, status)\
        VALUES ($1,$2,$3,requested)\
        RETURNING id;\
      ";

      client.query(queryString, [params.item_id, params.owner_id, params.borrower_id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var changeRequestStatusFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        UPDATE requests\
        SET status=$2\ 
        WHERE id=$1\
        RETURNING id;\
      ";

      client.query(queryString, [params.id, params.status], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var deleteRequestFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        DELETE FROM requests\
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

  var getByRequestIdFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT *\
        FROM requests\
        INNER JOIN items
        ON requests.item_id = items.id
        WHERE requests.id=$1;\
      ";

      client.query(queryString, [params.id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var getByOwnerIdFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT *\
        FROM requests\
        INNER JOIN items
        ON requests.item_id = items.id
        INNER JOIN users
        ON requests.borrower_id = users.id
        WHERE requests.owner_id=$1;\
      ";

      client.query(queryString, [params.owner_id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  var getByBorrowerIdFn = function(params, callback){
    pg.connect(conString, function(err, client, done){
      if(err) return console.log('error fetching client from pool', err);
      var queryString = "\
        SELECT *\
        FROM requests\
        INNER JOIN items
        ON requests.item_id = items.id
        INNER JOIN users
        ON requests.owner_id = users.id
        WHERE requests.borrower_id=$1;\
      ";

      client.query(queryString, [params.borrower_id], function(err, result){
        done();
        if(err) return console.log('error running query', err);
        callback(result.rows);
        return;
      });
    }); 
  };

  createTable();

  return {
    newRequest          : newRequestFn,
    changeRequestStatus : changeRequestStatusFn,
    deleteRequest       : deleteRequestFn,
    getByRequestId      : getByRequestIdFn,
    getByOwnerId        : getByOwnerIdFn,
    getByBorrowerId     : getByBorrowerIdFn
  }
};
