const mongoose=require('mongoose')
const Schema=mongoose.Schema


const appointmentsSchema=new Schema(
    {
        userId:String,
        doctorId:String,
        timeStart:Date,
        timeEnd:Date,
        description: String,
        status: String,
        comments:{
            type:Array,
            default:[]
        }
    }
)

module.exports=mongoose.model('Appointments',appointmentsSchema)