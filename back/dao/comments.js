const users = require('./users')
const appointments = require("../dao/appointments");
const Comments  = require('../model/Comments')

module.exports={
    async createComment(userId, appointmentId,content){
        try{
            if(!userId) throw 'no userId'
            if(!appointmentId) throw 'no appointmentId'
            if(!content) throw 'no content of comment'
            const user =await users.getUser(userId)
            if(!user) throw 'userId not exists'
            const appointment = await appointments.getAppointments(appointmentId)
            if(!appointment) throw 'appointmentId not exists'
            const comment = new Comments(
                {
                    userId:userId,
                    appointmentId:appointmentId,
                    timeStamp:new Date(),
                    content: content
                }
            )
            const insertInfo = await comment.save()
            await appointments.addCommentsToAppointments(appointmentId,insertInfo._id)
            return insertInfo._id
        }catch(e){
            throw e;
        }
    }
}