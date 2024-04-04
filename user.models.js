const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const Schema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        lower:true
    },
    password:String
},{
    timestamps:true
    
})


Schema.pre("save",async function(next){
    const user  = this;

    if(user.isModified("password")){
        this.password= await bcryptjs.hash(this.password,10)
    }
    next()
})

Schema.methods.comparePassword=async function(string_pass){
   
   const result =   await bcryptjs.compare(string_pass,this.password)
     
   return result
}

module.exports = mongoose.model("user",Schema)