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
}