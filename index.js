require("dotenv").config({
    path:'./.env.local'
})
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { ConnectDB } = require("./db.config")
const app = express()
ConnectDB()

const port = process.env.PORT || 8700

/// middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json({limit:'10mb'}))
app.use(cors())
app.use(morgan("dev"))

app.use("/api/v1",require("./auth.routes"))

app.get("*",(req,res)=>{
    res.send({
        msg:"this is wroking"
    })
})

app.listen(port,()=>{
    console.log(`the app is listen at port http://localhost:${port}`);
})