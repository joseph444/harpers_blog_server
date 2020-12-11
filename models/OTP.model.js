const mongoose=require('mongoose');
const OTPSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true,
    },
    number:{
        type:Number,
        required:true,
    },
    used:{
        type:Boolean,
        default:false,

    },
    sendAt:{
        type:Number,
        default:new Date().getTime(),
        required: true
    }
});
module.exports=mongoose.model('OTP',OTPSchema)