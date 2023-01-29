const mongoose=require('mongoose')
const Schema=mongoose.Schema


const commentsSchema=new Schema(
    {
        userId:String,
        appointmentId:String,
        timeStamp:Date,
        content: String,
    }
)

module.exports=mongoose.model('Comments',commentsSchema)