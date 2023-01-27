const mongoCollections = require('../config/mongoCollections');
const appointments = mongoCollections.appointments;
const users = require('./users');
const { ObjectId } = require('mongodb');

module.exports={
    async createAppointment(userId, doctorId, timestart, timeend,description){
        if(!userId) throw "noUserId";
        if(!doctorId) throw "noDoctorId";
        if(!timestart) throw "noTimestart";
        if(!timeend) throw "noTimeend";
        const appointmentsCollection = await appointments();
        //check time availiable for the doctor and user---->
        let newAppointment = {
            userId: userId,
            doctorId:doctorId,
            timestart:timestart,
            timeend:timeend,
            description:description,
            comments:[]
        }
        const insertInfo = await appointmentsCollection.insertOne(newAppointment);
        if(insertInfo.insertedCount==0) throw 'cannot add appointments';
        const appointmentId = insertInfo.insertedId;
        return await this.getAppointments(appointmentId); 
    },

    
    async getAllAppointments(){
        const appointmentsCollection = await appointments();
        return await appointmentsCollection.find({}).toArray();
    },

    async getAppointments(id){
        const appointmentsCollection = await appointments();
        if(typeof(id)=='string') id = ObjectId(id);
        const theappointments = await appointmentsCollection.findOne({_id:id});
        if(theappointments === null) throw 'No appointments with this id';
        return theappointments;
    },

    async getAllAppointmentsForDoctor(doctorId){
        const appointmentsCollection = await appointments();
        if(typeof(doctorId)=='string') doctorId = ObjectId(doctorId);
        const doctorAppointments = await appointmentsCollection.find({doctorId:doctorId}).toArray()
        if(doctorAppointments == null) throw 'No appointments with this doctorId';
        return doctorAppointments;
    },

    async getAllAppointmentsForUser(userId){
        const appointmentsCollection = await appointments();
        if(typeof(userId)=='string') userId = ObjectId(userId);
        const doctorAppointments = await appointmentsCollection.find({userId:userId}).toArray()
        if(doctorAppointments == null) throw 'No appointments with this userId';
        return doctorAppointments;
    }
}