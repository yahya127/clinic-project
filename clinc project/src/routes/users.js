const express=require('express')
const userModel = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/authorization')
router.post('/add/user', async (req,res) => {
    const user = new userModel(req.body)
    try{
        await user.save()
        const token = await user.generateToken()
        res.send({
            status: 1,
            message:'data inserted successfuly',
            data: {user, token}
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'data inserting error',
            data: e
        })
    }
})

router.get('/showAll/user', async(req,res)=>{
    try{
        console.log('inside route')
         alldata = await userModel.find({})
            res.send({
                status:1,
                message: 'all data retriverd',
                data: alldata
            })
    }
    catch(e){const auth = require('../middleware/authorization')

        res.send({
            status:0,
            message: 'data retreving error',
            data: e
        })
    }
})

router.get('/single/user/:userid',auth, async(req,res)=>{
    userid = req.params.userid
    try{
        userData = await userModel.findById(userid)
        if(!userData) return res.send({
            status:2,
            message: 'not found',
            data: ''
        })
        res.send({
            status:1,
            message: 'user data retriverd',
            data: userdata
           
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'data retrive error',
            data: e
        })
    }
   
})

router.patch('/user/edit/:userid',auth, async(req,res)=>{
    avlUpdates = ["name", "age"]
    const keys = Object.keys(req.body) // [name]
    const flag = keys.every((k)=> avlUpdates.includes(k))  //name true 
    if(!flag) return res.send({
        status:0,
        message:"invalid update keys",
        data:""
    })
    try{
        const user = await userModel.findByIdAndUpdate(
            req.params.userid,
            req.body,
            {runValidators:true}
        )
        if(!user) return res.send({
            status:2,
            message: 'user not found',
            data:''
        })
        res.send({
            status:1,
            message:"updated",
            data: user
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in edit',
            data: ''
        })
    }
})

router.delete('/user/delete/:userid',auth, async(req,res)=>{
    try{
        const user = await userModel.findByIdAndDelete(req.params.userid)
        if(!user) return res.send({
            status:2,
            message: 'user not found'
        })
        res.send({
            status:1,
            message:"deleted"
        })
    }
    catch(e){
        res.send({
            status:0,
            message: 'error in delete'
        })
    }
})

router.post('/user/login', async(req, res)=>{

    try{
        const user = await userModel.findLogin(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({
            status:1,
            message: 'user founded',
            data: {user, token}
        })
    }
    catch(e){
        res.send({
            status: 0,
            message:'invalid login',
            data:e
        })
    }
})

router.get('/user/profile', auth, async(req,res)=>{
    res.send({
        status:1,
        data:req.user,
        message:"data retreived"
    })
})

router.post('/user/logout',auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((singletoken)=>{
            return singletoken.token !== req.token
        })
        await req.user.save()
        res.send({
            status:1,
            message:"logged out"
        })
    }
    catch(e){
        res.send({
            status:0,
            message:"cann't logout"
        })
    }
})

router.post('/user/logoutall',auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({
            status:1,
            message:'logged out'
        })
    }
    catch(e){
        res.send({
            status:0,
            message:"cann't logout"
        })
    }
})

module.exports = router