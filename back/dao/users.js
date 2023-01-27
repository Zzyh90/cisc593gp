const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

module.exports = {
    async addUser(firstName, lastName, email, passwordHash, isdoctor, doctorAppointments = [],userAppointments=[]) {
        if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
        if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
        if(!email || typeof email!= 'string') throw 'you must provide a valid email';
        if(typeof isdoctor !='boolean') throw 'you must indicate you are doctor or not';
        if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';

        const usersCollection = await users();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: passwordHash,
            isdoctor:isdoctor,
            doctorAppointments:doctorAppointments,
            userAppointments: userAppointments,
        };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        return await this.getUser(newId);
    },

    async getAllUsers() {
        const usersCollection = await users();
        return usersCollection.find({}).toArray();
    },

    async getUser(id) {
        if (!id) throw 'You must provide a user id to search for';

        const objId = ObjectId(id);
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: objId });
        if (user === null) throw 'No user with this id';

        return user;
    },

    async getUserByEmail(email){
        if(!email || typeof email !== 'string'){
            throw "You need to provide an email";
        }
        const usersCollection = await users();
        const user = await usersCollection.findOne({email:email});
        if(user === null){
            throw "Invalid email";
        }
        return user;
    },

    async updateUser(id , updatedUser) {
        const usersCollection = await users();
        id = ObjectId(id)
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

        let result = await usersCollection.updateOne({_id:id}, {$set:updatedUserData});
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
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: userId });
        if(!user.isdoctor){
            throw 'Not a doctor'
        }else{
            //Need to check time conflict
            const updateInfo = await usersCollection.updateOne({_id:userId},{$push:{doctorAppointments:appointmentId}});
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
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: userId });
        if(user.isdoctor){
            throw 'Not a user'
        }else{
            //Need to check time conflict
            const updateInfo = await usersCollection.updateOne({_id:userId},{$push:{userAppointments:appointmentId}});
            if(updateInfo.modifiedCount === 0) throw 'Can not add appointment to user';
        }

        return true;
    }
}