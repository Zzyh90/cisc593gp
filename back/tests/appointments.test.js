const users= require('../dao/users')
const Users = require ('../model/Users')
const Appointments = require('../model/Appointments')
const appointments = require('../dao/appointments')

const db= require('./db')
const bcrypt = require("bcrypt")
const { ObjectId } = require('mongodb')


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

        expect(await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T09:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description")).toEqual("Invalid Time")
        
    })
})