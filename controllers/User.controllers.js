const userModel = require("../models").UserModel
const Imports = require("../imports");
const OTPControllers = require("./OTP.controllers");
module.exports={
    register:async (req,res)=>{
        try {
            var errors=await _validateRegister(req.body);
            if(errors){
                return res.json({
                    status:false,
                    message:errors,
                    errorType:"VALIDATION",
                    error:['Validation Error']
                });
            }
            const newUserDoc = {
                name:req.body.name,
                email:req.body.email,
                password:Imports.hash.hashPassword(req.body.password.trim()),
            }

            const newUser = new userModel(newUserDoc);
            const flag =  await newUser.save()

            const Payload = newUser.toObject()
            var tokenResponse={};
            try {
                await OTPControllers.createOTP(newUser._id,req.body.email);
                tokenResponse  =await Imports.hash.createToken(Payload,108000);
            } catch (error) {
                await newUser.delete();
                throw error
            }
           
            return res.json({
                status:true,
                ...tokenResponse
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
    },

    login: async (req,res)=>{
        try {
            const errors  =await _validateLogin(req.body);
            console.log(errors);
            if(errors){
                return res.json({
                    status:false,
                    message:errors,
                    errorType:"VALIDATION",
                    error:"Validation error"
                })
            }
            var email = req.body.email;
            var password = req.body.password;

            var user = await Imports.user.findUserByEmail(email)
            if(Imports.hash.verifyPassword(user.password,password)===true){
                const Payload = user.toObject();
                const tokenResponse =await Imports.hash.createToken(Payload)
                return res.json({
                    status:true,
                    ...tokenResponse
                });
            }
            return res.json({
                status:false,
                message:"invalid password",
                errorType:"AUTH",
                error:"Invald Password"
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
    },
    logout:async function(req,res){
        
        try {
            var authorization = req.headers.authorization;
            if(authorization.split(" ")[0]!=='Bearer'){
               return res.json({
                    status:false,
                    message:"Unauthorized",
                    errorType:"Unauthorized",
                    error:"Token Invalid"
                });
            }
            var token = authorization.split(" ")[1];
            await Imports.hash.addTokenToBlackList(token);
           return res.json({
                status:true,
                message:"Logged Out"
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
    },
    
    
}

const _validateRegister=async (body)=>{
    var name,email,password,confirmPassword;
   try {
         name = body.name.trim();

   } catch (error) {
       return "Name field is required"
   }
    try {
         email = body.email.trim();
    } catch (error) {
        return "Email field is required"
    }
    try {
         password = body.password.trim();
    } catch (error) {
        return "Password Field is required"
    }
    try {
         confirmPassword = body.confirmPassword.trim();
    } catch (error) {
        return "confirm password field is required"
    }

   
    if(!password){
        return "Password field is required";
    }

    if(password.length<8){
        return "Password must be more than 8 characters long"
    }
    if(confirmPassword!==password){
        return "Confirm password field should be same as Password field"
    }
    if(!email){
        return "Email Field is Required"
    }
    if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return "Invalid Email"
    }
    if(await Imports.user.findUserByEmail(email)){
        return "User already Exists"
    }
}


const _validateLogin = async (body)=>{
    var email,password;
    try {
            email = body.email.trim();
    } catch (error) {
        return "Email field is required"
    }
    try {
            password = body.password.trim();
    } catch (error) {
        return "Password Field is required"
    }
    if(!password){
        return "Password field is required";
    }

    if(password.length<8){
            return "Password must be more than 8 characters long"
    }

    if(!email){
        return "Email Field is Required"
    }
    if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return "Invalid Email"
    }
    if(!await Imports.user.findUserByEmail(email)){
        return "User Doesn't Exists"
    }
}