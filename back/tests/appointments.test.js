const users= require('../dao/users')
const Users = require ('../model/Users')
const Appointments = require('../model/Appointments')
const appointments = require('../dao/appointments')

const db= require('./db')
const bcrypt = require("bcrypt")
const { ObjectId } = require('mongodb')
const { updateOne } = require('../model/Users')


beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("appointment creation", ()=>{
    it('create an appointment', async () =>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)

        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T08:30:00'),"test appointment description");
        const appointment = await Appointments.findById(appointId);
        const user0 = await users.getUser(userId);
        const doctor0 = await users.getUser(doctorId);

        expect(appointment.doctorId).toEqual(doctorId.toString())
        expect(appointment.userId).toEqual(userId.toString())
        expect(appointment.description).toEqual("test appointment description")
        expect(user0.userAppointments.includes(appointId)).toBeTruthy()
        expect(doctor0.doctorAppointments.includes(appointId)).toBeTruthy()
        
    })

    it('check incoming time validation with existing appointments',async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description");
        const resultUser = await Users.findById(userId)
        caseTrue = await appointments.checkTimeValidation(new Date('2023-01-26T10:00:00'),new Date('2023-01-26T11:30:00'),resultUser.userAppointments)
        caseFalse = await appointments.checkTimeValidation(new Date('2023-01-26T09:00:00'),new Date('2023-01-26T11:30:00'),resultUser.userAppointments)
        expect(caseTrue).toEqual(true)
        expect(caseFalse).toEqual(false)
    })

    it('create an appointment with conflict time', async () =>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)

        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description");
        try{
            await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T09:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description")
        }catch(e){
            expect(e).toEqual('Invalid Time')
        }
        
        
    })
    it('update an appointment with new description', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description");
        const oldApp = await Appointments.findById(appointId);
        await appointments.updateAppointment(appointId,null,null,"updated test description", null);
        const updatedApp = await Appointments.findById(appointId);
        expect(updatedApp._id).toEqual(oldApp._id)
        expect(updatedApp.timeStart).toEqual(oldApp.timeStart)
        expect(updatedApp.timeEnd).toEqual(oldApp.timeEnd)
        expect(updatedApp.description).not.toEqual(oldApp.description)
        expect(updatedApp.description).toEqual("updated test description")
        expect(updatedApp.status).toEqual(oldApp.status)
    })

    it('update an appointment with new time', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const appointId1 = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T11:00:00'),new Date('2023-01-26T14:30:00'),"test appointment description2");
        const oldApp = await Appointments.findById(appointId);
        await appointments.updateAppointment(appointId,new Date('2023-01-26T10:00:00'),new Date('2023-01-26T10:30:00'),"updated test description1", null);
        const updatedApp = await Appointments.findById(appointId);
        expect(updatedApp._id).toEqual(oldApp._id)
        expect(updatedApp.timeStart).toEqual(new Date('2023-01-26T10:00:00'))
        expect(updatedApp.timeEnd).toEqual(new Date('2023-01-26T10:30:00'))
        expect(updatedApp.description).toEqual("updated test description1")
    })

    it('update an appointment with new conflict time', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const appointId1 = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T11:00:00'),new Date('2023-01-26T14:30:00'),"test appointment description2");
        const oldApp = await Appointments.findById(appointId);
        try{
            await appointments.updateAppointment(appointId,new Date('2023-01-26T09:00:00'),new Date('2023-01-26T11:30:00'),"updated test description1", null);
        }catch(e){
            expect(e).toEqual('Invalid Time')
        }
        const updatedApp = await Appointments.findById(appointId);
        expect(updatedApp._id).toEqual(oldApp._id)
        expect(updatedApp.timeStart).toEqual(oldApp.timeStart)
        expect(updatedApp.timeEnd).toEqual(oldApp.timeEnd)
        expect(updatedApp.description).toEqual(oldApp.description)
        expect(updatedApp.status).toEqual(oldApp.status)
    })

    it('cancel an appointment',async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const oldApp = await Appointments.findById(appointId);
        await appointments.updateAppointment(appointId,null,null,"updated test description1", "Inactive");
        const updatedApp = await Appointments.findById(appointId);
        expect(updatedApp._id).toEqual(oldApp._id)
        expect(updatedApp.timeStart).toEqual(oldApp.timeStart)
        expect(updatedApp.timeEnd).toEqual(oldApp.timeEnd)
        expect(updatedApp.description).not.toEqual(oldApp.description)
        expect(updatedApp.status).not.toEqual(oldApp.status)
        expect(updatedApp.status).toEqual("Inactive")
    })

    it('update an apppointment after cancelation', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const oldApp = await Appointments.findById(appointId);
        await appointments.updateAppointment(appointId,null,null,"updated test description1", "Inactive");
        try{
            await appointments.updateAppointment(appointId,new Date('2023-01-26T09:00:00'),new Date('2023-01-26T11:30:00'),"updated test description2", null);
        }catch(e){
            expect(e).toEqual('Cannot update canceled appointment')
        }
        const updatedApp = await Appointments.findById(appointId);
        expect(updatedApp._id).toEqual(oldApp._id)
        expect(updatedApp.timeStart).toEqual(oldApp.timeStart)
        expect(updatedApp.timeEnd).toEqual(oldApp.timeEnd)
        expect(updatedApp.description).toEqual("updated test description1")
        expect(updatedApp.status).toEqual("Inactive")
    })
})