const Appointments = require("../model/Appointments")
const mongoose = require("mongoose");
const users= require('../dao/users')
const Users = require ('../model/Users')
const appointments = require("../dao/appointments")


async function main(){
    mongoose.connect(
        'mongodb://localhost:27017/',
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
          if(err) console.log("cant connect",err)
          else{
              console.log("Connected to MongoDB");
          }
        }
      );
      await mongoose.connection.dropDatabase()
      // const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
      // const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
      // const user0 = await users.getUser(userId);
      // const doctor0 = await users.getUser(doctorId);
      // await appointments.createAppointment(user0._id,doctor0._id,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T08:30:00'),"test appointment description");

      const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
      await users.addAppointmentsToUser(userId, 'testappointmentId')
      const user = await Users.findById(userId)
      const appointmentId = user.userAppointments[0]
      console.log(appointmentId) 
      
      await mongoose.connection.close()

}

main().catch((error) => {
	console.error(error);
});
