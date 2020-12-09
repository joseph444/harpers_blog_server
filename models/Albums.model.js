const mongoose=require('mongoose');    
const AlbumsSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true
    },
    authorName:{
        type:String
    },
    createdAt:{
        type:String,
        default:new Date().toUTCString()
    },
    covers:{
        type:Array,
        required:true,
        minlength:1
    }
});
module.exports=mongoose.model('Albums',AlbumsSchema)