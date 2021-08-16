const express = require('express');
const router = express.Router();
const {ensureAuth , ensureGuest} = require('../middleware/auth')

//Data Schema 가져오기
const Data = require('../../model/Data')

//login 연결
router.get('/' , ensureGuest , (req ,res) => {
    res.render('login' , {
        layout : 'login'
    })
})


//dashboard 연결
router.get('/dashboard' , ensureAuth , async  (req , res) => {
    try{
        const stories = await Data.find({user : req.user.id}).lean()
        res.render('dashboard' , {
            name : req.user.firstName,
            stories
        })
    }catch(err){
        console.error(err);
        res.render('/error/500')
    }
   
})


module.exports = router;