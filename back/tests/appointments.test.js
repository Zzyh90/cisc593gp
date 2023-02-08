const users= require('../dao/users')
const Users = require ('../model/Users')
const Appointments = require('../model/Appointments')
const appointments = require('../dao/appointments')
const Comments = require('../model/Comments')
const comments = require('../dao/comments')

const db= require('./db')
const bcrypt = require("bcrypt")


beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("appointment creation", ()=>{
/* ----------------------------------------------------------------------------------------------------------------------------------   
    Test case create an appointment
    Input: patient: 'mike','ike','ike@gmail.com','testpassword1!',false
          doctor:  'adada','dasdaw','zzzzz@gmail.com','testpassword1!',true
          appointment: patientId,doctorId,new '2023-01-26T08:00:00','2023-01-26T08:30:00',"test appointment description"
    Expected output: appointment doctorId equal to adada's id
                    appointment userId equal to mike's id
                    appointment description equal to "test appointment description"
                    mike's userappointment has appointment's id
                    adada's doctorappointment has appointment's id
    Actual output: appointment doctorId equal to adada's id
                    appointment userId equal to mike's id
                    appointment description equal to "test appointment description"
                    mike's userappointment has appointment's id
                    adada's doctorappointment has appointment's id
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case check input time has time conflict with existing appointments
    Input: appointment with time from '2023-01-26T08:00:00' to '2023-01-26T09:30:00'
          newtime1 without conflict from '2023-01-26T10:00:00' to '2023-01-26T11:30:00'
          newtime2 with conflict from '2023-01-26T09:00:00' to '2023-01-26T11:30:00'
    Expected output: no conflict with newtime1, conflict with newtime2
    Actual output: no conflict with newtime1, conflict with newtime2
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case create an appointment with conflict time
    Input: 
          appointment1: from '2023-01-26T08:00:00' to '2023-01-26T09:30:00'
          appointment2: from '2023-01-26T09:00:00' to '2023-01-26T09:30:00'
    Expected output: cannot create appointment2, exception 'Invalid Time'
    Actual output: exception 'Invalid Time'
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case update an appointment with new description
    Inputs: 
          appointment with description 'test appointment description'
          new description "updated test description"
    Expected output: only the description updated, others remain the same
    Actual output: only the description updated, others remain the same
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case update an appointment with new time
    Inputs: 
          appointment with time '2023-01-26T08:00:00'-'2023-01-26T09:30:00', description:"test appointment description1"
          new time '2023-01-26T10:00:00' - '2023-01-26T10:30:00'
          new description: "updated test description1"
    Expected output: appointment's time will update to '2023-01-26T10:00:00' - '2023-01-26T10:30:00', description will update to "updated test description1"
    Actual output: appointment's time will update to '2023-01-26T10:00:00' - '2023-01-26T10:30:00', description will update to "updated test description1"
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case update an appointment with new conflict time
    Inputs: 
          appointment1 with time  '2023-01-26T08:00:00' - '2023-01-26T09:30:00'
          appoinment2 with time '2023-01-26T11:00:00' - '2023-01-26T14:30:00'
          new time '2023-01-26T09:00:00' - '2023-01-26T11:30:00'
    Expected output: exception when update appoinment1 with new time due to conflict on appointment2. Time will remain the same
    Actual output: exception 'Invalid Time', appointment1 time will remain the same
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case cancel an appointment
    Input: 
          appointment: '2023-01-26T08:00:00' - '2023-01-26T09:30:00', description: "test appointment description1"
          update the appointment with 'Inactive' status and new description
    Expected output: appointment status change to 'Inactive' with new description
    Actual output: appointment status change to 'Inactive' with new description
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case cancel an appointment
    Input: 
          appointment: '2023-01-26T08:00:00' - '2023-01-26T09:30:00', description: "test appointment description1"
          update the appointment with 'Inactive' status and new description
          update the appointment with new time '2023-01-26T09:00:00' - '2023-01-26T11:30:00' and new description
    Expected output: cannot updatet the appointment time, get exception 'Cannot update canceled appointment'. The time remain the same but the description updated.
    Actual output: cannot updatet the appointment time, get exception 'Cannot update canceled appointment'. The time remain the same but the description updated.
----------------------------------------------------------------------------------------------------------------------------------*/
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
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case create comment on appointment
    Input: 
         appointment: patient: 'mike', doctor:'adada', time: '2023-01-26T08:00:00'-'2023-01-26T09:30:00',description:"test appointment description1"
         comment: 'mike', content:"regular comments"
    Expected output: comment has mike's id as userid, has appointment's id as appointmentId, has content "regular comments", the appointment has comments with the comment's id
    Actual output: comment has mike's id as userid, has appointment's id as appointmentId, has content "regular comments", the appointment has comments with the comment's id
----------------------------------------------------------------------------------------------------------------------------------*/
    it('create comment', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const commentId = await comments.createComment(userId,appointId,"regular comments")

        const comment = await Comments.findById(commentId)
        expect(comment.userId).toEqual(userId.toString())
        expect(comment.appointmentId).toEqual(appointId.toString())
        expect(comment.content).toEqual("regular comments")
        const app = await Appointments.findById(appointId)
        expect(app.comments.includes(commentId.toString())).toBeTruthy()

    })
/* ----------------------------------------------------------------------------------------------------------------------------------
    Test case get comment with Id
    Input: get comment id when create comment on appointment
    Expected output: the fetch comment from the db has same info as it was created
    Actual output: the fetch comment from the db has same info as it was created
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Get comment', async()=>{
        const userId= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',false)
        const doctorId= await users.addUser('adada','dasdaw','zzzzz@gmail.com','testpassword1!',true)
        const appointId = await appointments.createAppointment(userId,doctorId,new Date('2023-01-26T08:00:00'),new Date('2023-01-26T09:30:00'),"test appointment description1");
        const commentId = await comments.createComment(userId,appointId,"regular comments")

        const comment = await Comments.findById(commentId)
        const thecomment = await comments.getComment(commentId)
        expect(comment.userId).toEqual(thecomment.userId)
        expect(comment.appointmentId).toEqual(thecomment.appointmentId)
        expect(comment.content).toEqual(thecomment.content)
        expect(comment.timeStamp).toEqual(thecomment.timeStamp)
    })
})