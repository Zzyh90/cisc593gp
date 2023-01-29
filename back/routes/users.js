const express = require('express');
const router = express.Router();
const data = require('..');
const users=require('../dao/users')




router.post("/createUser",async(req,res)=>{
    console.log("taco",req.body)
    const {firstName, lastName, email, passwordHash, isdoctor} = req.body
    try{
       const {userId}= await users.addUser(firstName,lastName,email,passwordHash,isdoctor)
       res.status(200).json(userId)
    }catch(err){
        res.status(500).json({"errorMessage":err})
    }
})


router.get("/getAllUsers",async(req,res)=>{
    try{
       const allUsers= await users.getAllUsers()
       res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json({"errorMessage":err})
    }
})

router.get("/getUser/:id",async(req,res)=>{
    const user_id=req.params.id
    try{
       const user= await users.getUser(user_id)
       res.status(200).json(user)
    }catch(err){
        res.status(500).json({"errorMessage":err})
    }
})


module.exports = router;