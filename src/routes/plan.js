const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth')


//Data Schema 가져오기
const Data = require('../../model/Data');


// plan showing
router.get('/add' , ensureAuth , async (req ,res) => {
    try{
        res.render('plan/add')
    }catch(err){
        console.error(err);
        return res.render('error/500')
    }
       
})

//process plan showing post
router.post('/' , ensureAuth , async (req ,res) => {
        try{
            req.body.user = req.user.id;
            await Data.create(req.body)
            res.redirect('/dashboard')
        }catch(err){
            console.error(err);
            res.render('error/500')
        }
})


//show read more
router.get('/' , ensureAuth , async (req ,res) => {
        try{
            const plans = await Data.find({status: 'public'})
                .populate('user')
                .sort({createdAt: 'desc'})
                .lean()

                res.render('plan/index' , {
                    plans
                })
        }catch(err){
            console.error(err);
            res.render('error/500')
        }

})

//read more
router.get('/:id' , ensureAuth , async (req ,res) => {
    try{
        let data = await Data.findById(req.params.id)
        .populate('user')
        .lean()
        

        if(!data){
            return res.render('error/404')
        };


        res.render('plan/show' , {
            data : data
        });
    }catch(err){
        console.error(err);
        return res.render('error/500')
    }
       
})

//edit 
router.get('/edit/:id' , ensureAuth , async (req ,res) => {
        const data = await Data.findOne({
            _id : req.params.id
        }).lean();

        if(!data){
            return res.render('error/404')
        }

        if(data.user != req.user.id){
            res.redirect('/plan')
        }else{
            res.render('plan/edit' , {
                data,
            })
        }
})

//UpDate 
router.put('/:id' , ensureAuth , async (req ,res) => { 
        let data = await Data.findById(req.params.id).lean()

        if(!data){
            res.render('error/404')
        };

        try{
            if(data.user != req.user.id){
                res.redirect('/plan')
            }else{
                data = await Data.findOneAndUpdate({ _id: req.params.id} , req.body, {
                    new: true,
                    runValidators: true,
                })
    
                res.redirect('/dashboard')
            }
        }catch(err){
            console.log(err);
            res.render('error/500')
        }
})

//delete
router.delete('/:id' , ensureAuth , async (req ,res) => { 
    try{
        await Data.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')
    }catch(err){
        console.error(err);
        return res.render('error/500')
    }
})

//user read more
router.get('/user/:userId' , ensureAuth , async (req ,res) => {
    try{
        const data = await Data.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('plan/index' , {
            data : data
        })
    }catch(err){
        console.error(err);
        return res.render('error/500')
    }
       
})

module.exports = router;