const express = require('express');
const router = express.Router();
const appointments=require('../dao/appointments')
const utils = require('../common/utils')


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

router.post("/updateAppointment/:id", async(req,res)=>{
    try{
        const {userId, doctorId, timeStart, timeEnd, description,status} = req.body
        if((timeStart &&!utils.checkStartWithin30Days(timeStart)) || (timeEnd && !utils.checkStartWithin30Days(timeEnd))) throw "Input time is not within 30 days"
        const updatedAppointment = await appointments.updateAppointment(req.params.id, timeStart,timeEnd,description,status)
        res.status(200).json(updatedAppointment)
    }catch(err){
        res.status(500).json({"errorMessage":error.toString()})
    }
})

router.post("/cancelAppointment/:id",async(req,res)=>{
    try{
        const {userId, doctorId, timeStart, timeEnd, description,status} = req.body
        const updatedAppointment = await appointments.updateAppointment(req.params.id, null,null,null,"Inactive")
        res.status(200).json(updatedAppointment)
    }catch(err){
        res.status(500).json({"errorMessage":error.toString()})
    }
})

router.get("/userAppointments/:id", async(req,res)=>{
    try{
        const apps = await appointments.getAppointmentsByUser(req.params.id)
        res.status(200).json(apps)
    }catch(err){
        res.status(500).json({"errorMessage":error.toString()})
    }
})

module.exports = router;