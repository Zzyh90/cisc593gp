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
      const user0= await users.addUser('JaneToJohn','Baker','janeb@example.com','123123',false)
      console.log(user0)
      await mongoose.connection.close()
}

main().catch((error) => {
	console.error(error);
});