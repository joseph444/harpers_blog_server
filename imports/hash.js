const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const { tokenBlacklistModel } = require("../models");

module.exports={
    createToken:async function(Payload,time=2592000){
       try {
           Payload.uniquid = Math.floor(Math.random() * (new Date() - 0 + 1)) + 0;
           //console.log(Payload);
           //console.log(config.env.SECRET);
            const token = jwt.sign(Payload,config.env.SECRET_KEY,{
                expiresIn:time
            });
             await this.deleteTokenFromBlackList(token)
            const ExpiryDate = new Date().setDate(new Date().getDate()+time==2392000?30:0);
            //ExpiryDate = new Date(ExpiryDate).toUTCString();
            return{
                token:token,
                prefix:'bearer',
                expiresIn:ExpiryDate
            }
       } catch (error) {
           console.log(error);
           throw "Error in createToken"
       }
    },

    verifyToken:function(token){
       return  jwt.verify(token,config.env.SECRET)
    },

    hashPassword:(password)=>{
        try {
            console.log(password);
            return bcrypt.hashSync(password,10)
        } catch (error) {
            console.log(error);
            throw "Error in hashPassword"
        }
    },

    verifyPassword:(hashedPassword,password)=>{
        try {
            return bcrypt.compareSync(password,hashedPassword)
        } catch (error) {
            console.log(error);
            throw "Error in verifyPassword"
        }
    },

    getUserFromHeader:async (Authorization)=>{
        try {
            if(Authorization.split(' ')[0]==='Bearer'){
                const token = Authorization.split(' ')[1];
                return jwt.verify(token,config.env.SECRET_KEY)
            }
        } catch (error) {
            console.log(error);
            throw "Error in getUserFromHeader"
        }
    },

    addTokenToBlackList:async (token)=>{
        try {
            const tt =await tokenBlacklistModel.findOne({token:token});
            if(!tt){
                await new tokenBlacklistModel({
                    token:token
                }).save();
            }else{
                tt.createdAt = new Date().toUTCString()
                await tt.save()
            }
            return true;
        } catch (error) {
            console.log(error);
            throw "Error in addTokenToBlackList"
        }
    },

    checkIfTokenInBlackList:async function(token){
        try {
            const tt =await tokenBlacklistModel.findOne({token:token});
            if(tt){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            throw "Error in checkIfTokenInBlackList"
        }
    },

    deleteTokenFromBlackList:async function(token){
        try {
            const tt =await tokenBlacklistModel.findOne({token:token});
            if(tt){
                await tt.delete()
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            throw "Error in deleteTokenFromBlackList"
        }
    }
   
}