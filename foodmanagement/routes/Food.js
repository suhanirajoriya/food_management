var express = require('express');
var Router = express.Router();
var pool = require('./pool');
var upload=require('./multer')
var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');




Router.get('/foodinterface', function (req, res, next) {

    try{
        var food=JSON.parse(localStorage.getItem('ADMIN'))

    if(food==null)
    {
     res.render('login',{msg:''})
    }
    res.render('Food_Interface', { status: null,msg:'' })
    }catch(e)
    {
        res.render('login', { msg:''}) 
    }
})

Router.post('/submit_record', upload.single('picture'), function (req, res) {
    console.log("BODY : ", req.body)
    console.log("FILE : ", req.file)

    pool.query('insert into fooddetails ( foodtypeid, foodid, Description, price, Offer_Price, food_type, status, picture) values(?,?,?,?,?,?,?,?)',
        [req.body.foodtypeid, req.body.foodid, req.body.description, req.body.price, req.body.Offer_Price, req.body.food_type, req.body.status, req.file.filename],
        function (error, result) {

            if (error) {
                console.log(error)
                res.render('Food_Interface', { message: 'server error', status: 0 })
            }
            else {
                console.log(result)
                res.render('Food_Interface', { message: 'Submitted ', status: 1 })
            }
        })

});

Router.get('/Display_All_Foods', function (req, res, next) {
   try{
    var food=JSON.parse(localStorage.getItem('ADMIN'))
   if(food==null)
   {
    res.render('login',{msg:''})
   }
    pool.query('select D.*,(select foodtype from foodtype T where T.foodtypeid=D.foodtypeid)as ftype,(select foodname from food F where F.foodid=D.foodid)  as fname from fooddetails D', function (error, result) {

        if (error) {
            res.render("Display_food", { status: false, result: [] })
        }
        else {
            res.render("Display_food", { status: true, result: result })
        }

    })
}catch(e)
{
  res.render('login',{msg:''})
}
});



Router.get('/displaybyid', function (req, res, next) {

    pool.query('select D.*,(select foodtype from foodtype T where T.foodtypeid=D.foodtypeid)as ftype,(select foodname from food F where F.foodid=D.foodid)  as fname from fooddetails D  where fooddetailid=?', [req.query.fid], function (error, result) {

        if (error) {
            res.render('displaybyid', { status: false, result: [] })
        }
        else {
            res.render('displaybyid', { status: true, result: result[0] })
        }

    })
});



Router.post('/update_data', function (req, res) {
    if (req.body.action == 'Edit') {
        console.log("BODY : ", req.body)

        pool.query('update  fooddetails set foodtypeid=?, foodid=?, Description=?, price=?, Offer_Price=?, food_type=?, status=? where fooddetailid=?',
            [req.body.foodtypeid, req.body.foodid, req.body.description, req.body.price, req.body.Offer_Price, req.body.food_type, req.body.status, req.body.fooddetailid],

            function (error, result) {

                if (error) {
                    console.log(error)
                    res.redirect('/Food_company/Display_All_Foods')
                }
                else {
                    console.log(result)
                    res.redirect('/Food_company/Display_All_Foods')
                }
            })
    }
    else {

        pool.query('delete from fooddetails where fooddetailid=?',
            [req.body.fooddetailid],

            function (error, result) {

                if (error) {
                    console.log(error)
                    res.redirect('/Food_company/Display_All_Foods')
                }
                else {
                    console.log(result)
                    res.redirect('/Food_company/Display_All_Foods')
                }
            })
    }

});


Router.get('/display_picture', function (req, res, next) {
    res.render('display_picture', { fid: req.query.fid, fname: req.query.fname, pic: req.query.pic, ftype:req.query.ftype })
})


Router.post('/Update_picture',upload.single('picture'), function (req, res, next) {

    pool.query('update fooddetails set picture=? where fooddetailid=?', [req.file.filename, req.body.fooddetailid], function (error, result) {

        if (error) {
            console.log(error)
            res.redirect('/Food_company/Display_All_Foods')
        }
        else {
            res.redirect('/Food_company/Display_All_Foods')
         
            var filePath = 'C:/users/shiva/food_management/public/images/'+req.body.old_picture; 
            fs.unlinkSync(filePath);
        }
    })



})


Router.get('/login', function (req, res, next) {
    res.render('login', { status: null })
})


Router.get('/dashboard', function (req, res, next) {
    res.render('dashboard', { status: null })
})




module.exports = Router