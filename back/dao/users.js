
const Users = require("../model/Users")
const bcrypt = require("bcrypt")
const { ObjectId } = require('mongodb')



module.exports = {
    async addUser(firstName, lastName, email, password, isdoctor, doctorAppointments = [],userAppointments=[]) {


        try {
            if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
            if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
            if(!email || typeof email!= 'string') throw 'you must provide a valid email';
            if(typeof isdoctor !='boolean') throw 'you must indicate you are doctor or not';
            if(!password || typeof password!= 'string') throw 'you must provide a valid password hash';

            const hashedPassword= await bcrypt.hash(password, 10)


            const newUser= new Users({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                isDoctor:isdoctor,
                doctorAppointments:doctorAppointments,
                userAppointments: userAppointments,
            })

            await newUser.save()

            return newUser._id
        }catch(err){
            throw err
        }
    },

    async getAllUsers() {
        try{
            const users= await Users.find()
            // const { password, ...other } = users._doc;
            res.status(200).json(users);
        }catch(err){
            return err
        }
    },

    async getUser(id) {
        try{
            if (!id) throw 'You must provide a user id to search for';

            const user= await Users.findById(id)
            const { password, ...other } = user._doc;
            return user;
        }catch(err){
            return err
        }
    },

    async getUserByEmail(email){
        try{
            if(!email || typeof email !== 'string'){
                throw "You need to provide an email";
            }
            const user = await Users.findOne({email:email})
            const { password, ...other } = user._doc;
            return user;
        }catch(err){
            return err
        }

    },

    async updateUser(id , updatedUser) {

        const updatedUserData = {};

        if (updatedUser.firstName) {
          updatedUserData.firstName = updatedUser.firstName;
        }
    
        if (updatedUser.lastName) {
          updatedUserData.lastName = updatedUser.lastName;
        }
    
        if (updatedUser.email) {
          updatedUserData.email = updatedUser.email;
        }
        if(typeof id ==='string'){
            id = ObjectId(id);
        };
        let result = await Users.updateOne({_id:id}, {$set:updatedUserData});
        if(result.modifiedCount === 0) throw "update failed"
        return await this.getUser(id);
    },
    async addAppointmentsTodoctor(userId, appointmentId){
        if(!userId) throw 'You must provide a user id';
        if(!appointmentId) throw 'You must provide a appointment id';
        if(typeof userId ==='string'){
            userId = ObjectId(userId);
        };
        appointmentId = appointmentId.toString();
        const user = await Users.findOne({ _id: userId });
        if(!user.isDoctor){
            throw 'Not a doctor'
        }else{
            const updateInfo = await Users.updateOne({_id:userId},{$push:{doctorAppointments:appointmentId}});
            if(updateInfo.modifiedCount === 0) throw 'Can not add appointment to doctor';
        }

        return true;
        
    },
    async addAppointmentsToUser(userId, appointmentId){
        if(!userId) throw 'You must provide a user id';
        if(!appointmentId) throw 'You must provide a appointment id';
        if(typeof userId ==='string'){
            userId = ObjectId(userId);
        };
        appointmentId = appointmentId.toString();
        const user = await Users.findOne({ _id: userId });
        if(user.isDoctor){
            throw 'Not a user'
        }else{
            const updateInfo = await Users.updateOne({_id:userId},{$push:{userAppointments:appointmentId}});
            if(updateInfo.modifiedCount === 0) throw 'Can not add appointment to user';
        }

        return true;
    }
}