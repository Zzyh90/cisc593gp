const Appointments = require('../model/Appointments');
const Users= require('../model/Users')
const Util = require('../common/utils')
const users = require('../dao/users')
const { ObjectId } = require('mongodb');

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
            const doctorsAppointments = doctor.doctorAppointments

            const validTimeFlag = await this.checkTimeValidation(timestart, timeend,usersAppointments) && await this.checkTimeValidation(timestart, timeend,doctorsAppointments);

            if(validTimeFlag){
                    const newAppointment = new Appointments({
                        userId: userId,
                        doctorId:doctorId,
                        timeStart:timestart,
                        timeEnd:timeend,
                        description:description
                    })
        
                    const insertInfo = await newAppointment.save()
                    await users.addAppointmentsTodoctor(doctorId,insertInfo._id)
                    await users.addAppointmentsToUser(userId,insertInfo._id)
                    
                    return newAppointment._id
            }else{
                    return "Invalid Time"
            }


        }catch(err){
            throw err
        }

    },

    
    async getAllAppointments(){
        try{
            return await Appointments.findAll()
        }catch(err){
            throw err
        }
    },

    async getAppointments(id){
        if(typeof(id)=='string') id = ObjectId(id);
        const theappointments = await Appointments.findOne({_id:id});
        if(theappointments === null) throw new Error('No appointments with this id');
        return theappointments;
    },
    async checkTimeValidation(timestart,timeend,appointments){
        if(appointments.length==0) return true;
        const appointmentsObject = await Appointments.find({_id:{$in:appointments}});
        let valid;
        for(let i=0;i<appointmentsObject.length;i++){
            if(i==0){
                valid = Util.determineTime(timestart, timeend,appointmentsObject[i].timeStart,appointmentsObject[i].timeEnd)
            }else{
                valid = valid&Util.determineTime(timestart, timeend,appointmentsObject[i].timeStart,appointmentsObject[i].timeEnd)
            }
        }
        return valid;
    }
}