const dbConnection = require('../config/mongoConnection');
const data = require('../dao/');
const users = data.users;
const passwordHash = require('password-hash');

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();
    let pwd = passwordHash.generate('123123');
    let doctor0, user0,doctor1,user1;
    try{
        doctor0 = await users.addUser("Jane","Baker",'janeb@example.com',pwd,true);
        doctor1 = await users.addUser("Jason", "Hovin","jasonh@example.com",pwd,true);
        user0 = await users.addUser('Bill', "Penceny","billp@example.com",pwd,false)
        user1 = await users.addUser('Stephanie',"Garfield","stephanieg@example.com",pwd,false)
    }catch(e){
        console.log(e);
    }
    // await db.serverConfig.close();
    await db.s.client.close();
}

main().catch((error) => {
	console.error(error);
});