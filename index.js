const express= require('express')
const cors= require("cors")
const mongoose = require ("mongoose")
const DATABASEurl="mongodb+srv://rathorshalini299:shalini123456@cluster0.mzvuk0b.mongodb.net/myproject?retryWrites=true&w=majority&appName=Cluster0"
const app= express()
const User= require('./db/users')
require("dotenv").config()
const Product_schema = require('./db/products')

app.use(express.json())
app.use(cors())


app.post("/register",async(req,res)=>{
    let user= new User(req.body);
    let result= await user.save()
    result= result.toObject()
    delete result.password
    res.send(result)
})

app.post('/login',async(req,res)=>{
    console.log("body",req.body);
    if (req.body.password && req.body.email ) {
        let user= await User.findOne(req.body).select("-password")
   if (user) {
    res.send({status:true,user:user})
   }else{
    res.send({status:false,result:"no user found"})
   }
    }
    //  let user= await User.findOne({name:req.body.name})  
})

app.post("/addproduct",async(req,res)=>{
    console.log("req.body",req.body);
   let create= new Product_schema(req.body)
   result= await create.save()
   res.send(result)
})

app.get('/',(req,res)=>{
    res.send("app is running now...")
})

app.listen(process.env.port,()=>{
    console.log(`server listen on${process.env.port}`);
    mongoose.connect(process.env.DATABASEurl)
    .then(()=>{
        console.log("mongodb connected")
    })
    .catch((err)=>console.log(err,"not connected" ))
})