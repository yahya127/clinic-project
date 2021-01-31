const jwt = require('jsonwebtoken')
const test = async() =>{

    let x = jwt.sign({id:5}, 'hossam')
    console.log(x)

    xx = jwt.verify(x,'hossam')
    console.log(xx)
}

test()
