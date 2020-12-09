const mongoose=require('mongoose');    
const { array } = require('yargs');
const StoriesSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true
    },
    bookCoverUrl:{
        type:String,
        required:false,
    },
    pages:{
        type:Array,
        required:true,
        minlength:1
    },
    createdAt:{
        type:String,
        default:new Date().toUTCString()
    }
});
    
module.exports=mongoose.model('Stories',StoriesSchema)