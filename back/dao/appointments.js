const Appointments = require('../model/Appointments');
const Users= require('../model/Users')
const Util = require('../common/utils')
const users = require('../dao/users')
const { ObjectId } = require('mongodb');
const ActiveStatus = 'Active';
const InactiveStatus = 'Inactive'

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
            if(typeof(timestart)=='string') timestart = new Date(timestart);
            if(typeof(timeend)=='string') timeend = new Date(timeend);

            const validTimeFlag = await this.checkTimeValidation(timestart, timeend,usersAppointments) && await this.checkTimeValidation(timestart, timeend,doctorsAppointments);

            if(validTimeFlag){
                    const newAppointment = new Appointments({
                        userId: userId,
                        doctorId:doctorId,
                        timeStart:timestart,
                        timeEnd:timeend,
                        description:description,
                        status:ActiveStatus,
                        comments:[]
                    })
        
                    const insertInfo = await newAppointment.save()
                    await users.addAppointmentsTodoctor(doctorId,insertInfo._id)
                    await users.addAppointmentsToUser(userId,insertInfo._id)
                    
                    return newAppointment._id
            }else{
                    throw "Invalid Time"
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
        try{
            const theappointments = await Appointments.findOne({_id:id});
            if(theappointments === null) throw 'No appointments with this id';
            return theappointments;
        }catch(e){
            throw e
        }
        
    },

    async getAppointmentsByUser(userId){
        if(typeof(userId)=='string') userId = ObjectId(userId)
        try{
            const user = await Users.findOne({_id:userId})
            if(!user) throw "userId not exists"
            if(user.isDoctor){
                return await Appointments.find({doctorId:userId});
            }else{
                return await Appointments.find({userId:userId})
            }

        }catch(e){
            throw e
        }
    },

    async checkTimeValidation(timestart,timeend,appointments){
        if(!Array.isArray(appointments)) throw 'appointments is not an array'
        if(appointments.length==0) return true;
        const appointmentsObject = await Appointments.find({_id:{$in:appointments}});
        let valid;
        for(let i=0;i<appointmentsObject.length;i++){
            if(appointmentsObject[i].status==ActiveStatus){
                if(i==0){
                    valid = Util.determineTime(timestart, timeend,appointmentsObject[i].timeStart,appointmentsObject[i].timeEnd)
                }else{
                    valid = valid&Util.determineTime(timestart, timeend,appointmentsObject[i].timeStart,appointmentsObject[i].timeEnd)
                }
            }else{
                if(i==0){
                    valid = true;
                }
            }
        }
        return valid;
    },

    async updateAppointment(id, timeStart,timeEnd,description,status){
        if(typeof(id)=='string') id = ObjectId(id);
        const appointment = await this.getAppointments(id);
        if(!appointment) throw 'Invalid appointment Id'
        if(appointment.status == InactiveStatus ) throw 'Cannot update canceled appointment'
        const user= await users.getUser(appointment.userId)
        const doctor = await users.getUser(appointment.doctorId)
        let usersAppointments = user.userAppointments
        usersAppointments.splice(usersAppointments.indexOf(id.toString()),1)
        let doctorsAppointments = doctor.doctorAppointments
        doctorsAppointments.splice(doctorsAppointments.indexOf(id.toString()),1)
        if((timeStart != null && timeStart != undefined) || (timeEnd != null && timeEnd != undefined)){
            if(timeStart == null || timeStart == undefined) timeStart = appointment.timeStart
            if(timeEnd == null || timeEnd == undefined) timeEnd = appointment.timeEnd
            const validTimeFlag = await this.checkTimeValidation(timeStart, timeEnd,usersAppointments) && await this.checkTimeValidation(timeStart, timeEnd,doctorsAppointments);
            if(validTimeFlag){
                const updatedAppointment = {
                    userId: appointment.userId,
                    doctorId:appointment.doctorId,
                    timeStart:timeStart,
                    timeEnd:timeEnd,
                    description:description==undefined||description==null?appointment.description:description,
                    status:status==undefined||status==null?appointment.status:status
                }
    
                const insertInfo = await Appointments.updateOne({_id:id},{$set:updatedAppointment})
                return insertInfo
            }else{
                throw "Invalid Time"
            }
        }
            const updatedAppointment = {
                userId: appointment.userId,
                doctorId:appointment.doctorId,
                timeStart:appointment.timeStart,
                timeEnd:appointment.timeEnd,
                description:description==undefined||description==null?appointment.description:description,
                status:status==undefined||status==null?appointment.status:status
            }
            const insertInfo = await Appointments.updateOne({_id:id},{$set:updatedAppointment})
            return insertInfo
    },

    async addCommentsToAppointments(appointmentId, commentId){
        if(!commentId) throw 'You must provide a commentId';
        if(!appointmentId) throw 'You must provide a appointment id';
        if(typeof appointmentId ==='string'){
            appointmentId = ObjectId(appointmentId);
        };
        commentId = commentId.toString();
        const updateInfo = await Appointments.updateOne({_id:appointmentId},{$push:{comments:commentId}});
        if(updateInfo.modifiedCount === 0) throw 'Can not add comments to appointment';
        return true;
    }

}