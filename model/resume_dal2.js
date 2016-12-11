var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
create or replace view resume_view as
select r.*, a.first_name, a.last_name from resume r
left join account a on a.account_id = r.account_id;
*/

/*
 create or replace view resume_view2 as
 select r.*, c.company_name, sk.name as skill_name, sc.school_name from resume r
 left join resume_company rc on rc.resume_id = r.resume_id
 left join company c on c.company_id = rc.company_id
 left join resume_skill rs on rs.resume_id = r.resume_id
 left join skill sk on sk.skill_id = rs.skill_id
 left join resume_school rsc on rsc.resume_id = r.resume_id
 left join school sc on sc.school_id = rsc.school_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getAll2 = function(callback) {
    var query = 'SELECT * FROM resume_view2;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * from resume_view WHERE resume_id = ?';
    var queryData = [resume_id];
    //console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE RESUME
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        console.log (result);

        // THEN USE THE RESUME_ID RETURNED AS insertId AND THE SELECTED SKILL_IDs INTO RESUME_SKILL
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var queryRS = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var queryRC = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var queryRSc = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSkillData = [];
        for (var i = 0; i < params.skill_id.length; i++) {
            resumeSkillData.push([resume_id, params.skill_id[i]]);
        }

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeCompanyData = [];
        for (var i = 0; i < params.company_id.length; i++) {
            resumeCompanyData.push([resume_id, params.company_id[i]]);
        }

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSchoolData = [];
        for (var i = 0; i < params.school_id.length; i++) {
            resumeSchoolData.push([resume_id, params.school_id[i]]);
        }

        // NOTE THE EXTRA [] AROUND resumeSkillData
        connection.query(queryRS, [resumeSkillData], function (err, result) {

            // NOTE THE EXTRA [] AROUND resumeCompanyData
            connection.query(queryRC, [resumeCompanyData], function (err, result) {
                //callback(err, result);

                // NOTE THE EXTRA [] AROUND resumeSchoolData
                connection.query(queryRSc, [resumeSchoolData], function (err, result) {
                    callback(err, result);
                });
            });
        });
    });
};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


//declare the function so it can be used locally
var resumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;

//declare the function so it can be used locally
var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;


//declare the function so it can be used locally
var resumeCompanyInsert = function(resume_id, companyIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];
    for(var i=0; i < companyIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIdArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeCompanyInsert = resumeCompanyInsert;

//declare the function so it can be used locally
var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;


//declare the function so it can be used locally
var resumeSchoolInsert = function(resume_id, schoolIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSchoolInsert = resumeSchoolInsert;

//declare the function so it can be used locally
var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;


exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ?, account_id = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.account_id, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.update2 = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete resume_skill entries for this resume
        resumeSkillDeleteAll(params.resume_id, function(err, result) {

            if (params.skill_id != null) {
                //insert resume_skill ids
                resumeSkillInsert(params.resume_id, params.skill_id, function (err, result) {
                    //callback(err, result);
                });
            }
            else {
                callback(err, result);
            }
            //delete resume_company entries for this resume
            resumeCompanyDeleteAll(params.resume_id, function (err, result) {

                if (params.company_id != null) {
                    //insert resume_company ids
                    resumeCompanyInsert(params.resume_id, params.company_id, function (err, result) {
                        //callback(err, result);
                    });
                }
                else {
                    callback(err, result);
                }
                //delete resume_school entries for this resume
                resumeSchoolDeleteAll(params.resume_id, function (err, result) {

                    if (params.school_id != null) {
                        //insert resume_school ids
                        resumeSchoolInsert(params.resume_id, params.school_id, function (err, result) {
                            callback(err, result);
                        });
                    }
                    else {
                        callback(err, result);
                    }
                });
            });
        });
    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS resume_getinfo;
 DELIMITER //
 CREATE PROCEDURE resume_getinfo (_resume_id int)
 BEGIN
 SELECT * FROM resume WHERE resume_id = _resume_id;
 SELECT sk.*, rs.resume_id FROM skill sk
 LEFT JOIN resume_skill rs on rs.skill_id = sk.skill_id AND resume_id = _resume_id
 ORDER BY sk.name;
 END //
 DELIMITER ;
 # Call the Stored Procedure
 CALL resume_getinfo (4);
 */
/*
exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
*/
exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getInfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};