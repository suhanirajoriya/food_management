var express = require('express')
var router = express.Router()
var pool = require('./pool')

router.get('/fetchfoodtype', function (req, res, next) {
    pool.query('select * from foodtype', function (error, result) {
        if (error) {
            res.status(500).json({ status: false })
        }
        else {
            res.status(200).json({ status: true, ftypes: result })
        }
    })
});

router.get('/fetchfoodid', function (req, res, next) {
    pool.query('select * from food where foodtypeid=?',[req.query.foodtypeid], function (error, result) {
        if (error) {
            res.status(500).json({ status: false })
        }
        else {
            res.status(200).json({ status: true, result:result })
        }
    })
})
module.exports = router;