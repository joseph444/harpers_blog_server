const Imports = require("../imports");
const ProfileModel = require("../models/Profile.model");

module.exports={
    profile:async (req,res)=>{
        try {
            const errors = await __validate(req.body);
            const user =await Imports.hash.getUserFromHeader(req.headers.authorization);
            const profile =await ProfileModel.findOne({userId:user._id});
            if(!profile){
                profile = ProfileModel.create({
                    userId:user._id,
                    Username:req.body.username,
                    profilePicUrl:req.body.profileImgUrl
                });
                await profile.save();
            }
            else{
                profile.Username=req.body.username;
                profile.profilePicUrl=req.body.profileImgUrl;
                await profile.save()
            }

            return res.json({
                status:true,
                message:"Profile Updated"
            })
        } catch (error) {
            console.log(error);
            return res.json({
                status:false,
                message:"Some Error Occured",
                errorType:"SYSTEM",
                error:[error]
            })
        }
    }
}

const __validate = async function(body){
    if(!body.profileImgUrl){
        return "Profile Image Url required"
    }
    
    if(!body.username){
        return "Name is required"
    }

    if(body.username.trim()===""){
        return "Name can't be empty"
    }
}