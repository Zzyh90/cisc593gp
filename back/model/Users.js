const mongoose=require('mongoose')
const Schema=mongoose.Schema


const usersSchema=new Schema(
    {
        firstName:String,
        lastName:String,
        email:String,
        password:String,
        isDoctor: Boolean,
        doctorAppointments:{
            type:Array,
            default:[]
        },
        userAppointments:{
            type:Array,
            default:[]
        }
    }
)

module.exports=mongoose.model('Users',usersSchema)