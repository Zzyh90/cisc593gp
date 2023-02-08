const users= require('../dao/users')
const Users = require ('../model/Users')

const db= require('./db')
const bcrypt = require("bcrypt")
const { ObjectId } = require('mongodb')


beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("user test cases", ()=>{
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case create a patient user.
    Input first name: ugur, last name: yilmaz, email:ugur@gmail.com, isdoctor:false
    Expected output: first name: ugur, last name: yilmaz, email:ugur@gmail.com, isdoctor:false
    Actual Result: first name: ugur, last name: yilmaz, email:ugur@gmail.com, isdoctor:false
----------------------------------------------------------------------------------------------------------------------------------*/
    it('create patient user', async () =>{
        const userId= await users.addUser('ugur','yilmaz','ugur@gmail.com','12345',false)
        const user = await Users.findById(userId)
        expect(user.firstName).toEqual("ugur")
        expect(user.lastName).toEqual("yilmaz")
        expect(user.email).toEqual("ugur@gmail.com")
        expect(user.isDoctor).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case create a doctor user.
    Input： first name: doctor, last name: michael, email:michael@gmail.com, isdoctor:true
    Expected output: first name: doctor, last name: michael, email:michael@gmail.com, isdoctor:true
    Actual Result: first name: doctor, last name: michael, email:michael@gmail.com, isdoctor:true
----------------------------------------------------------------------------------------------------------------------------------*/
    it('create doctor user', async () =>{
        const userId= await users.addUser('doctor','michael','michael@gmail.com','12345',true)
        const user = await Users.findById(userId)
        expect(user.firstName).toEqual("doctor")
        expect(user.lastName).toEqual("michael")
        expect(user.email).toEqual("michael@gmail.com")
        expect(user.isDoctor).toEqual(true)

    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case created user's password is hashed
    Input: first name: mike, last name: ike, email:mike@gmail.com, password:testpassword1!, isdoctor:true
    Expect Output: true when compare the hashed testpassword1! and stored password, false when compare the stored password and testpassword1
    Actual Result: true, false
----------------------------------------------------------------------------------------------------------------------------------*/
    it('user has the right password secured', async () =>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',true)
        const user = await Users.findById(userId)
        const validPassword= await bcrypt.compare('testpassword1!', user.password)
        expect(validPassword).toEqual(true)
        expect(user.password).not.toEqual('testpassword1!')

    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case creat multiple user
    Inputs: 
           user: first name: mike, last name: ike, email:mike@gmail.com, password:testpassword1!, isdoctor:true
           user1: first name: John, last name: col, email:johnc@gmail.com, password:testpassword2!, isdoctor:false
    Expect Output: two uers are created correctly and the id of this two users are different
    Actual Result:  user: first name: mike, last name: ike, email:mike@gmail.com, password:testpassword1!, isdoctor:true
                    user1: first name: John, last name: col, email:johnc@gmail.com, password:testpassword2!, isdoctor:false
                    user id is not equal to user1 id
----------------------------------------------------------------------------------------------------------------------------------*/
    it('create multiple user', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',true)
        const userId1= await users.addUser('John','col','johnc@gmail.com','testpassword2!',false)
        const user = await Users.findById(userId)
        const user1= await Users.findById(userId1)

        expect(user.firstName).toEqual('mike')
        expect(user.email).toEqual('ike@gmail.com')
        expect(user.isDoctor).toEqual(true)
        expect(user1.firstName).toEqual('John')
        expect(user1.email).toEqual('johnc@gmail.com')
        expect(user1.isDoctor).toEqual(false)
        expect(user._id).not.toEqual(user1._id)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case add appointment Id to patient
    Inputs: user: first name: mike, last name: ike, email:mike@gmail.com, password:testpassword1!, isdoctor:false
           appointId: testappointmentId
    Expect output: true when check user's userappointments has an appointment with 'testappointmentId', false when check user's doctorappointments has an appointment with 'testappointmentId'
    Actual output: true, false
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Add an appointmentId to patient', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        await users.addAppointmentsToUser(userId, 'testappointmentId')
        const user = await Users.findById(userId)
        expect(user.userAppointments.includes('testappointmentId')).toBeTruthy()
        expect(user.doctorAppointments.includes('testappointmentId')).not.toBeTruthy()
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case add appointment Id to doctor
    Inputs: 
           user: first name: james, last name: ola, email:jola@gmail.com, password:testpassword1!, isdoctor:true
           appointId: testappointmentIdfordoctor
    Expect output: false when check user's userappointments has an appointment with 'testappointmentIdfordoctor', true when check user's doctorappointments has an appointment with 'testappointmentId'
    Actual output: false, true
----------------------------------------------------------------------------------------------------------------------------------*/    
    it('Add an appointmentId to doctor', async()=>{
        const userId= await users.addUser('james','ola','jola@gmail.com','testpassword1!',true)
        await users.addAppointmentsTodoctor(userId, 'testappointmentIdfordoctor')
        const user = await Users.findById(userId)
        expect(user.userAppointments.includes('testappointmentId')).not.toBeTruthy()
        expect(user.doctorAppointments.includes('testappointmentIdfordoctor')).toBeTruthy()
    })
})