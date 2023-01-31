const express = require('express');
const router = express.Router();
const appointments=require('../dao/appointments')
const comments = require('../dao/comments')
const utils = require('../common/utils');
const users = require('../dao/users');


router.post("/createAppointment",async(req,res)=>{
    try{
       const {userId, doctorId, timeStart, timeEnd, description} = req.body
       const appointmentId= await appointments.createAppointment(userId,doctorId,timeStart, timeEnd, description)
       res.status(200).json(appointmentId)
    }catch(err){
        res.status(500).json({errorMessage:err.toString()})
    }
})


router.get("/getAllAppointments",async(req,res)=>{
    try{
       const allAppointments= await appointments.getAllAppointments()
       res.status(200).json(allAppointments)
    }catch(err){
        res.status(500).json({errorMessage:err.toString()})
    }
})

//get by appointmentId
router.get("/appointment/:id",async(req,res)=>{
    try{
       const appointment= await appointments.getAppointments(req.params.id)
       const user = await users.getUser(appointment.userId)
       const doctor = await users.getUser(appointment.doctorId)
       appointment.doctorFirstName =doctor.firstName
       appointment.doctorLastName = doctor.lastName
       appointment.userFirstName = user.firstName
       appointment.userLastName = user.lastName
       let thecomments = []
       for (let c of appointment.comments){
        thecomments.push(await comments.getComment(c))
       }
       res.status(200).json({
        _id: appointment._id,
        userId:appointment.userId,
        doctorId:appointment.doctorId,
        doctorName: doctor.firstName+" "+doctor.lastName,
        userName: user.firstName+" "+user.lastName,
        timeStart:appointment.timeStart,
        timeEnd:appointment.timeEnd,
        description:appointment.description,
        status:appointment.status,
        comments: thecomments
       })
    }catch(err){
        res.status(500).json({errorMessage:err.toString()})
    }
})
router.get("/appointmentByUser", async(req,res)=>{
    let user = req.body
    const userId = user.userId
    try{
        const apps = await appointments.getAppointmentsByUser(userId)
        console.log(appointments)
        let result = []
        for(let appointment of apps){
            console.log(appointment)
            const user = await users.getUser(appointment.userId)
            const doctor = await users.getUser(appointment.doctorId)
            appointment.doctorFirstName =doctor.firstName
            appointment.doctorLastName = doctor.lastName
            appointment.userFirstName = user.firstName
            appointment.userLastName = user.lastName
            let thecomments = []
            for (let c of appointment.comments){
             thecomments.push(await comments.getComment(c))
            }
            result.push({
                _id: appointment._id,
                userId:appointment.userId,
                doctorId:appointment.doctorId,
                doctorName: doctor.firstName+" "+doctor.lastName,
                userName: user.firstName+" "+user.lastName,
                timeStart:appointment.timeStart,
                timeEnd:appointment.timeEnd,
                description:appointment.description,
                status:appointment.status,
                comments: thecomments
               })
        }
       res.status(200).json(result)
    }catch(e){
        res.status(500).json({
            errorMessage:e
        })
    }
})
router.post("/updateAppointment/:id", async(req,res)=>{
    try{
        let {userId, doctorId, timeStart, timeEnd, description,status} = req.body
        let error = []
        if(timeStart) timeStart = new Date(timeStart)
        if(timeEnd) timeEnd = new Date(timeEnd)
        if((timeStart &&!utils.checkStartWithin30Days(timeStart)) || (timeEnd && !utils.checkStartWithin30Days(timeEnd))) error.push("Input time is not within 30 days")
        if(error.length>0) res.status(200).json({error:true,errorMessage:error})
        const updatedAppointment = await appointments.updateAppointment(req.params.id, timeStart,timeEnd,description,status)
        res.status(200).json(updatedAppointment)
    }catch(err){
        res.status(500).json({errorMessage:err.toString()})
    }
})

router.post("/cancelAppointment/:id",async(req,res)=>{
    try{
        // const {userId, doctorId, timeStart, timeEnd, description,status} = req.body
        const updatedAppointment = await appointments.updateAppointment(req.params.id, null,null,null,"Inactive")
        res.status(200).json(updatedAppointment)
    }catch(err){
        res.status(500).json({errorMessage:error.toString()})
    }
})


router.post("/createComment", async(req,res)=>{
    try{
        const {userId, appointmentId,content} = req.body
        const comment = await comments.createComment(userId,appointmentId,content)
        res.status(200).json(comment)
    }catch(e){
        res.status(500).json({errorMessage:e.toString()})
    }
})

module.exports = router;