const Appointments = require('../model/Appointments');
const Users= require('../model/Users')
const Util = require('../common/utils')
const users = require('../dao/users')

module.exports={
    async createAppointment(userId, doctorId, timestart, timeend,description){
        try{
            if(!userId) throw "noUserId";
            if(!doctorId) throw "noDoctorId";
            if(!timestart) throw "noTimestart";
            if(!timeend) throw "noTimeend";

            //check if the user and doctors exists

            const user= await users.getUser(userId)

            if(!user) throw new Error('user cannot be found')

            const doctor = await users.getUser(doctorId)

            if(!doctor) throw 'doctor cannot be found'

            if(!doctor.isDoctor){
                console.log('eveett')
                throw new Error('this account is not a doctor')
            } 

            //check time availiable for the doctor and user---->
            const usersAppointments = user.userAppointments
            const doctorsAppointments = doctor.userAppointments
            let validTimeFlag = true;
            for(let appointmentId of usersAppointments){
                let appointment = await Appointments.findById(appointmentId)
                validTimeFlag = validTimeFlag && Util.checkValidTimestamp(timestart, timeend,appointment.timeStart,appointment.timeEnd)
            }
            for(let appointmentId of doctorsAppointments){
                let appointment = await Appointments.findById(appointmentId)
                validTimeFlag = validTimeFlag && Util.checkValidTimestamp(timestart, timeend,appointment.timeStart,appointment.timeEnd)
            }
            if(validTimeFlag){
                const newAppointment = new Appointments({
                    userId: userId,
                    doctorId:doctorId,
                    timestart:timestart,
                    timeend:timeend,
                    description:description
                })
    
                await newAppointment.save()
                
                return {
                    appointmentId:newAppointment._id
                } 
            }else{
                return 'Invalid time'
            }

        }catch(err){
            throw err
        }

    },

    
    async getAllAppointments(){
        try{
            return await Appointments.findAll()
        }catch(err){
            return err
        }
    },

    async getAppointments(id){
        if(typeof(id)=='string') id = ObjectId(id);
        const theappointments = await Appointments.findOne({_id:id});
        if(theappointments === null) throw new Error('No appointments with this id');
        return theappointments;
    }
}