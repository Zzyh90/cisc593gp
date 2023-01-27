
const Users = require("../model/Users")


module.exports = {
    async addUser(firstName, lastName, email, passwordHash, isdoctor, doctorAppointments = [],userAppointments=[]) {


        try {
            if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
            if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
            if(!email || typeof email!= 'string') throw 'you must provide a valid email';
            if(typeof isdoctor !='boolean') throw 'you must indicate you are doctor or not';
            if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';


            const newUser= new Users({
                firstName: firstName,
                lastName: lastName,
                email: email,
                passwordHash: passwordHash,
                isDoctor:isdoctor,
                doctorAppointments:doctorAppointments,
                userAppointments: userAppointments,
            })

            await newUser.save()

            return {
                userId:newUser._id
            }
        }catch(err){
            throw err
        }
    },

    async getAllUsers() {
        try{
            const users= await Users.findAll()
            const { password, ...other } = users._doc;
            res.status(200).json(other);
        }catch(err){
            return err
        }
    },

    async getUser(id) {
        try{
            if (!id) throw 'You must provide a user id to search for';

            const user= await Users.findById(id)
            const { password, ...other } = user._doc;
            res.status(200).json(other);
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
            res.status(200).json(other);
            return user;
        }catch(err){
            return err
        }

    },
}