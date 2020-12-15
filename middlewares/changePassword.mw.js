const Imports = require("../imports");

module.exports=async (req,res,next)=>{
    try {
        const user =await Imports.hash.getUserFromHeader(req.headers.authorization);
        const auth = req.headers.authorization;
        const token = auth.split(" ")[1]
        if(await Imports.hash.checkIfTokenInBlackList(token)===false){
            if(user.changePassword){
                if(await Imports.user.findUserById(user._id)){
                  return  next()
                }
            }
        }
        return res.json({
            status:false,
            message:"Unauthorized",
            errorType:"UNAUTHROZIED",
            error:"unauthorized user"
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status:false,
            message:"Unauthorized",
            errorType:"UNAUTHROZIED",
            error:"unauthorized user"
        })
    }    
}