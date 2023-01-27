const users= require('../dao/users')
const Users = require ('../model/Users')

const db= require('./db')

beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("user creation", ()=>{
    it('create user', async () =>{
        const {userId}= await users.addUser('ugur','yilmaz','ugur@gmail.com','12345',false)


        const user = await Users.findById(userId)

        expect(user.firstName).toEqual("ugur")
        expect(user.lastName).toEqual("yilmaz")
        expect(user.email).toEqual("ugur@gmail.com")
        expect(user.passwordHash).toEqual("12345")
        expect(user.isDoctor).toEqual(false)

    })
})