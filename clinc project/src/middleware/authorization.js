const jwt = require('jsonwebtoken')
const User = require('../models/users')
const auth = async(req,res,next) =>{
    console.log('inside middleware')
    /*
    - get token from headers => Authoriztion => Bearer {token} => done
    - decode token and get id => done
    - search user have token , id => done
    - authorized next or unauthorized stop
    */
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decodedToken = jwt.verify( token , "HiAll" )
        console.log(decodedToken)
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token': token})
        console.log(user)
        if(!user){ throw new Error() }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.send({
            data:e,
            message:'please authintcate',
            status: 0
        })
    }
}
module.exports = auth

//60057296c9b9b5281465d7f2