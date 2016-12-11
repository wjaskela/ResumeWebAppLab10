var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal2');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('resume/resumeViewById', {'result': result});
           }
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    resume_dal.getAll2(function(err,result) {
        skill_dal.getAll(function (err, skill) {
            account_dal.getAll(function (err, account) {
                company_dal.getAll(function (err, company) {
                    school_dal.getAll(function (err, school) {
                        if (err) {
                            res.send('Undefined')
                        }
                        else {
                            res.render('resume/resumeAdd', {
                                account: account,
                                skill: skill,
                                company: company,
                                school: school
                            });
                        }
                    });
                });
            });
        });
    });
});

// View the resume for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == "") {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An Account must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function (err, result) {
            console.log(result);
            console.log(result.length);
            //res.send (result);
            account_dal.getAll(function (err, account) {
                res.render('resume/resumeUpdate', {
                    resume: result[0][0], account: account, company: result[2], skill: result[1], school: result[3]
                });
            });
        });
    }
});

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function (err, resume) {
            account_dal.getAll(function (err, account) {
                if (err) {
                    res.send('Undefined')
                }
                else {
                    //res.send (resume)
                    //res.send (account)
                    res.render('resume/resumeUpdate', {resume: resume[0], account: account});
                }
            });
        });
    }
});

router.get('/update', function(req, res){
    resume_dal.update2(req.query, function(err, result){
        res.redirect(302, '/resume/all');
    });
});

// Delete a resume for the given account_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

module.exports = router;
