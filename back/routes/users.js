const express = require('express');
const router = express.Router();
const users=require('../dao/users')
const bcrypt = require("bcrypt")




router.post("/createUser",async(req,res)=>{
    console.log("taco",req.body)
    const {firstName, lastName, email, password, isdoctor} = req.body
    try{
       const userId= await users.addUser(firstName,lastName,email,password,isdoctor)
       res.status(200).json(userId)
    }catch(err){
        res.status(500).json({errorMessage:err})
    }
})


router.get("/getAllUsers",async(req,res)=>{
    try{
       const allUsers= await users.getAllUsers()
       res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json({errorMessage:err})
    }
})

router.get("/getUser/:id",async(req,res)=>{
    const user_id=req.params.id
    try{
       const user= await users.getUser(user_id)
       res.status(200).json(user)
    }catch(err){
        res.status(500).json({errorMessage:err})
    }
})

router.post("/register", async(req,res)=>{
    let newUser = req.body;
    let errors = [];
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newUser.firstName) errors.push('No first Name');
    if(!newUser.lastName) errors.push('No last Name');
    if(!newUser.email) errors.push('No email');
    if(newUser.email && !emailRegex.test(newUser.email)) errors.push('Invalid email');
    if (!newUser.password) errors.push('No password provided');
    if(newUser.password && newUser.password.length < 8) errors.push('Password should contain at least 8 characters');
    if (!newUser.password_confirm)  errors.push('No password confirmation provided');
    if(newUser.password_confirm !== newUser.password)   errors.push('Passwords don\'t match');
    newUser.email = newUser.email.toLowerCase();
    try{
        const existingEmail =  await users.getUserByEmail(newUser.email.toLowerCase());
        if (existingEmail)
            errors.push('An account with this email already exists.');
    } catch(e) {
        errors.push(e)
    }

    if (errors.length > 0) {
		res.status(200).json( {
			errorMessage: errors,
		});
		return;
    }
    try {
        await users.addUser(newUser.firstName,newUser.lastName,newUser.email.toLowerCase(),newUser.password,newUser.isdoctor)
        let newRegister = await users.getUserByEmail(newUser.email.toLowerCase());
        res.status(200).json(newRegister);
    }catch(e){
        res.status(500).json({errorMessage: e.toString()})
    }
  
})

router.post("login", async(req,res)=>{
    let loginfo = req.body;
    let errors = [];

    if(!loginfo.email) errors.push('No email');
    if(!loginfo.password) errors.push('No password');
    if(errors.length>0){
        res.status(200).json({
            errorMessage:errors,
        });
    };
    let user;
    try{
        user = await users.getUserByEmail(loginfo.email.toLowerCase());
    }catch(e){
        res.status(200).json({
            errorMessage:'Invalid email and/or password'
        });
    }
    const comparedHashedPassword = await bcrypt.compare(loginfo.password,user.password);
    if(comparedHashedPassword){
        req.session.user = {firstName:user.firstName,lastName:user.lastName,userId:user._id};
        res.status(200).json({
            loggom:true,
            data:user
        });
    }else{
        res.status(200).json({
            errorMessage:'Invalid email and/or password'
        });
    }
})
module.exports = router;