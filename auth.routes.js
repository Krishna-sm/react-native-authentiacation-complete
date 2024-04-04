const express = require("express")
const httpStatus = require("http-status")
const UserModel = require("./user.models")
const { generateToken, verifyToken } = require("./token.utils")

const router = express.Router()



router.route("/register")
.post(async(req,res)=>{
    try {
        const {name,email,password} = req.body

        if(!name || !email ||!password){
            throw new Error("Please fill All Fileds")
            return
        }

        const checkExist = await UserModel.findOne({email});
        if(checkExist){
            throw new Error("User ALredy Exist")
            return
        }


       const user=  await UserModel.create({name,email,password})
     const token = await   generateToken(user)

     res.status(httpStatus.CREATED).send({
        msg:"Register SuccessFully",
        token
     })
      
        
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send({
            error:error.message || 'something went wrong'
        })
    }
})


router.route("/login")
.post(async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email ||!password){
            throw new Error("Please fill All Fileds")
            return
        }

        const checkExist = await UserModel.findOne({email});
        if(!checkExist){
            throw new Error("User Not Exist")
            return
        }


        const isVerified = await checkExist.comparePassword(password)
        if(!isVerified){
             throw new Error("Invalid Credentials")
            return
        }
 
     const token = await   generateToken(checkExist)

     res.status(httpStatus.OK).send({
        msg:"Login SuccessFully",
        token
     })
      
        
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send({
            error:error.message || 'something went wrong'
        })
    }
})


router.route("/profile")
.get(async(req,res)=>{
    try {
        const authToken= req.headers['authorization'] || ''

        if(!authToken){
            throw new Error("Please provide valid Token")
            return
        }

        const token = authToken.split(" ")[1]
 
        if(!token){
            throw new Error("Please provide  JWT valid Token")

            return
        }

const {userId} =  await verifyToken(token)
    if(!userId){
        throw new Error("Details Not Found")
    }


    const user= await UserModel.findById(userId).select("name email")

     res.status(httpStatus.OK).send({
        msg:"Login SuccessFully",
        user
     })
      
        
    } catch (error) {

        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
            error:error.message || 'something went wrong'
        })
    }
})
module.exports  = router