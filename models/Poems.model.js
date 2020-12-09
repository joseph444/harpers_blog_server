const mongoose=require('mongoose');    
const PoemsSchema=new mongoose.Schema({
	userId:{
        type:String,
        required:true
    },
    authorName:{
        type:String
    },
    headerImageUrl:{
        type:String,
        required:false,
    },
    backgroundType:{
        type:String,
        default: 'none'
    },
    background:{
        type:String,
    },
    title:{
        type:String,
        default:'Untitled'
    },
    lines:{
        type:Array,
        required:true

    },
    createdAt:{
        type:String,
        default:new Date().toUTCString()
    }


});
    
module.exports=mongoose.model('Poems',PoemsSchema)