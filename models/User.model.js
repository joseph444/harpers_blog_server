const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
	name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required: true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    verfiedAt:{
        type:String,
        default:""
    },
    createdAt:{
        type:String,
        default:new Date().toUTCString()

    }
});
module.exports=mongoose.model('User',UserSchema)