const express = require('express');
const router = express.Router();
const data = require('..');
const appointments=require('../dao/appointments')


router.post("/createAppointment",async(req,res)=>{
    try{
       const {userId, doctorId, timeStart, timeEnd, description} = req.body
       const {appointmentId}= await appointments.createAppointment(userId,doctorId,timeStart, timeEnd, description)
       res.status(200).json(appointmentId)
    }catch(err){
        res.status(500).json({"errorMessage":err.toString()})
    }
})


router.get("/getAllAppointments",async(req,res)=>{
    try{
       const allAppointments= await appointments.getAllAppointments()
       res.status(200).json(allAppointments)
    }catch(err){
        res.status(500).json({"errorMessage":err.toString()})
    }
})

router.get("/appointment/:id",async(req,res)=>{
    try{
       const appointment= await appointments.getAppointments(req.params.id)
       res.status(200).json(appointment)
    }catch(err){
        res.status(500).json({"errorMessage":err.toString()})
    }
})

module.exports = router;