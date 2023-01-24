var express = require('express');
var Router = express.Router();
var pool = require('./pool');
var upload = require('./multer')
var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


Router.get('/admin_login', function (req, res, next) {
    res.render('login',{msg:''})
})

Router.post('/check_admin_login', function (req, res, next) {
    pool.query('select * from food_admin where (emailid=? or mobile=?) and password=?', [req.body.emailid, req.body.emailid, req.body.password], function (error, result) {
        if (error) 
        {
            res.render('dashboard', { msg: 'SERVER ERROR', result: result })
        }
        else {
            if (result.length == 1) {
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                res.render('dashboard', { msg: '', result:result[0] })
            }
            else {
                res.render('login', { msg: 'INVALID EMAILID/MOBILE/PASSWORD' })
            }

        }



    })
})

Router.get('/logout', function (req, res, next) {
   localStorage.clear()
    res.render('login',{msg:''})
})



module.exports = Router