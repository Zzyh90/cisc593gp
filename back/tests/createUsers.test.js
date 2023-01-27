const users= require('../dao/users')
const Users = require ('../model/Users')

const db= require('./db')
const bcrypt = require("bcrypt")


beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("user creation", ()=>{
    it('create patient user', async () =>{
        const {userId}= await users.addUser('ugur','yilmaz','ugur@gmail.com','12345',false)


        const user = await Users.findById(userId)

        expect(user.firstName).toEqual("ugur")
        expect(user.lastName).toEqual("yilmaz")
        expect(user.email).toEqual("ugur@gmail.com")
        expect(user.isDoctor).toEqual(false)

    })

    it('create doctor user', async () =>{
        const {userId}= await users.addUser('doctor','michael','michael@gmail.com','12345',true)


        const user = await Users.findById(userId)


        expect(user.firstName).toEqual("doctor")
        expect(user.lastName).toEqual("michael")
        expect(user.email).toEqual("michael@gmail.com")
        expect(user.isDoctor).toEqual(true)

    })


    it('user has the right password secured', async () =>{
        const {userId}= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',true)


        const user = await Users.findById(userId)

        const validPassword= await bcrypt.compare('testpassword1!', user.password)


        expect(validPassword).toEqual(true)

        //because its salted and hashed in db
        expect(user.password).not.toEqual('testpassword1!')

    })

    it('user has the right password secured', async () =>{
        const {userId}= await users.addUser('mike','ike','ike@gmail.com','testpassword1!',true)


        const user = await Users.findById(userId)

        const validPassword= await bcrypt.compare('testpassword1!', user.password)


        expect(validPassword).toEqual(true)

        //because its salted and hashed in db
        expect(user.password).not.toEqual('testpassword1!')

    })
})