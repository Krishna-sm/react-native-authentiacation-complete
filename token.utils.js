const jwt = require("jsonwebtoken")
const JWT= process.env.JWT_AUTH


exports.generateToken = async(user)=>{
    const token = await jwt.sign({userId:user._id},JWT,{
        expiresIn:'30d'
    })

    return token
}



exports.verifyToken = async(token)=>{
    const data = await jwt.verify(token,JWT)

    return data
}