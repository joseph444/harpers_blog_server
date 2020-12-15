const mongoose=require('mongoose');
const ProfileSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true,
        unique:true
    },
    profilePicUrl:{
        type:String,
    },
    Username:{
        type:String,
        required:true,
        
    }
});
module.exports=mongoose.model('Profile',ProfileSchema)