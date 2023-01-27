const Appointments = require('../model/Appointments');
const Users= require('../model/Users')

module.exports={
    async createAppointment(userId, doctorId, timestart, timeend,description){
        try{
            if(!userId) throw "noUserId";
            if(!doctorId) throw "noDoctorId";
            if(!timestart) throw "noTimestart";
            if(!timeend) throw "noTimeend";
            //check time availiable for the doctor and user---->

            //check if the user and doctors exists

            const user= Users.findById(userId)

            if(!user) throw new Error('user cannot be found')

            const doctor = Users.findById(doctorId)

            if(!doctor) throw 'doctor cannot be found'

            if(!doctor.isDoctor){
                console.log('eveett')
                throw new Error('this account is not a doctor')
            } 


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
        const appointmentsCollection = await appointmentses();
        if(typeof(id)=='string') id = ObjectId(id);
        const theappointments = await appointmentsCollection.findOne({_id:id});
        if(theappointments === null) throw 'No appointments with this id';
        return theappointments;
    }
}