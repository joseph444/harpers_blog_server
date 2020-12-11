const mongoose=require('mongoose');   
const tokenBlacklistSchema=new mongoose.Schema({
	token:{
        type:String,
        required:true,
    },
    createdAt:{
        type:String,
        default: new Date().toUTCString()
    }

});
module.exports=mongoose.model('tokenBlacklist',tokenBlacklistSchema)