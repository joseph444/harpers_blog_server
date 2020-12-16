const OTPModel = require("../models/OTP.model");
const Imports = require("../imports");
const { UserModel } = require("../models");
module.exports={

    createOTP:async function(userID,to){
        try {
            const min = Math.ceil(10000);
            const max = Math.floor(99999);
            const otp =  Math.floor(Math.random() * (max - min + 1)) + min;

            OTPModel.findOneAndUpdate({
                number:otp,
                userId:userID
            },{
                $set:{
                    userId:userID,
                    number:otp,
                    used:false,
                }
            },{upsert:true},function(err,doc){
                if(err){
                    throw "Error in sending otp"
                }else{
                    Imports.mailer.sendMail(to,"Verifcation mail",`Your OTP is ${otp}.`)
                }
            });

        } catch (error) {
            console.log(error);
            throw "Error At Sending OTP"
        }
    },

    verifyOTP:async function(req,res){
        try {
            const otp = req.body.number;
            //console.log(req.headers);
        const user = await Imports.hash.getUserFromHeader(req.headers.authorization);

        const verifyOtp = await OTPModel.findOne({
            'userId':user._id,
            'number':otp,
            //'used':false
        });

        if(verifyOtp){
            let verifedAt = new Date().toUTCString();
            await OTPModel.findOneAndUpdate({
                number:otp,
                userId:user._id
            },{
                $set:{
                    userId:user._id,
                    number:otp,
                    used:true,
                  //  verifiedAt: new Date().toUTCString()
                }
            },{upsert:true});

            const User = await UserModel.findOne({'_id':user._id});
            User.verfiedAt = verifedAt;
           await User.save();
          // console.log(User);
            const Payload = User.toObject();
            var tokenResponse
            try {
                //await OTPControllers.createOTP(newUser._id,req.body.email);
                tokenResponse  =await Imports.hash.createToken(Payload);
            } catch (error) {
                await User.delete();
                throw error
            }

            res.json({
                status:true,
                ...tokenResponse
            });
        }else{
            res.json({
                status:false,
                message:"invalid OTP",
                errorType:"AUTH",
                error:"invalid OTP"
            })
        }
        } catch (error) {
            console.log(error);
            res.json({
                status:false,
                message:"Some Error Occured",
                errorType:"SYS",
                error:[error]
            })
        }

    },

    changePassword:async (req,res)=>{
        try {
            const otp = req.body.number;
            //console.log(req.headers);
           // const user = await Imports.hash.getUserFromHeader(req.headers.authorization);

            const verifyOtp = await OTPModel.findOne({
                'used':false,
                'number':otp,
                //'used':false
            });
            
            if(verifyOtp){
                
                let verifedAt = new Date().toUTCString();
                await OTPModel.findOneAndUpdate({
                    number:otp,
                    userId:verifyOtp.userId
                },{
                    $set:{
                        userId:verifyOtp.userId,
                        number:otp,
                        used:true,
                      //  verifiedAt: new Date().toUTCString()
                    }
                },{upsert:false});
    
                const User = await UserModel.findOne({'_id':verifyOtp.userId});
                
                
                const Payload = User.toObject();
                var tokenResponse
                try {
                    Payload.changePassword = true;
                    //await OTPControllers.createOTP(newUser._id,req.body.email);
                    tokenResponse  =await Imports.hash.createToken(Payload);
                } catch (error) {
                    //await User.delete();
                    throw error
                }
    
                res.json({
                    status:true,
                    ...tokenResponse
                });
                }else{
                    res.json({
                        status:false,
                        message:"invalid OTP",
                        errorType:"AUTH",
                        error:"invalid OTP"
                    })
                }
        } catch (error) {
            console.log(error);
            res.json({
                status:false,
                message:"Some Error Occured",
                errorType:"SYS",
                error:[error]
            })
        }
    }
}