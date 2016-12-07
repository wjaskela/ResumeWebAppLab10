var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS resume_getinfo;
 DELIMITER //
 CREATE PROCEDURE resume_getinfo (resume_id int)
 BEGIN
 SELECT * FROM account WHERE resume_id = resume_id;
 END //
 DELIMITER ;
 # Call the Stored Procedure
 CALL resume_getinfo (4);
 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};