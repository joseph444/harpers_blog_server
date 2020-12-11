const { isValidObjectId } = require("mongoose");
const UserModel = require("../models/User.model")




module.exports={
    findUserByEmail:async function(email){
        try {
           const user = await UserModel.findOne({
               email:email
           }).exec();
           if(user){
               return user;
           }
        } catch (error) {
            console.log(error);
            throw "Error in findUserByEmail"
        }
    },

    findUserById:async function(id){
        try {
            if(isValidObjectId(id)==false){
                throw "Invalid Object Id"
            }
            const user = await UserModel.findOne({
                '_id':id
            });
            if(user){
                return user;
            }
        } catch (error) {
            console.log(error);
            throw "Error in findUserById"
        }
    }
    
}