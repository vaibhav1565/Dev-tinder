const jwt = require('jsonwebtoken')
const {User} = require('../models/user')

const userAuth = async (req,res,next)=>{
    try{
        const { token } = req.cookies
        if (!token)
            throw new Error("Invalid token!!!");

        const decodedObj = jwt.verify(token, "private_key")
        const { _id } = decodedObj

        const user = await User.findById(_id)
        if (!user)
            throw new Error("User not found");
        req.user = user
        next()
    } catch(e) {
        res.status(400).send("ERROR: " + e.message)
    }
    
}

module.exports = {userAuth}