// const users = require("../model/Users")
// const appointments = require("../model/Appointments")
// const passwordHash = require('password-hash');
const utils = require("../common/utils")
async function main(){
    // const db = await dbConnection();
    // await db.dropDatabase();
    // let pwd = passwordHash.generate('123123');
    // let doctor0, user0,doctor1,user1;
    // try{
    //     doctor0 = await users.addUser("Jane","Baker",'janeb@example.com',pwd,true);
    //     doctor1 = await users.addUser("Jason", "Hovin","jasonh@example.com",pwd,true);
    //     user0 = await users.addUser('Bill', "Penceny","billp@example.com",pwd,false)
    //     user1 = await users.addUser('Stephanie',"Garfield","stephanieg@example.com",pwd,false)
    // }catch(e){
    //     console.log(e);
    // }
    // let timestart = new Date();
    // timestart.setFullYear(2023,00,26)
    // timestart.setHours(12,0,0,0);
    // let timeend = new Date();
    // timeend.setFullYear(2023,00,26)
    // timeend.setHours(13,0,0,0);
    // let appointment0 = await appointments.createAppointment(user0._id,doctor0._id,timestart, timeend,"testAppointments");
    // timestart = new Date();
    // timestart.setFullYear(2023,00,27)
    // timestart.setHours(12,0,0,0);
    // timeend = new Date();
    // timeend.setFullYear(2023,00,27)
    // timeend.setHours(13,0,0,0);
    // let appointment1 = await appointments.createAppointment(user1._id,doctor0._id,timestart, timeend,"testAppointments1");
    // users.addAppointmentsTodoctor(doctor0._id,appointment0._id);
    // users.addAppointmentsToUser(user0._id,appointment0._id);
    // let doctor0appointments = await appointments.getAllAppointmentsForDoctor(doctor0._id);
    // console.log(doctor0appointments);
    //
    //
    // // await db.serverConfig.close();
    // let updateUser = {
    //     firstName: 'JaneToJohn'
    // }
    // doctor0 = await users.updateUser(doctor0._id, updateUser);
    // await db.s.client.close();

    utils.determineTime(null, null, null, null);
}

main().catch((error) => {
	console.error(error);
});
