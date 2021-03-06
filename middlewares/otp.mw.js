module.exports=async (req,res,next)=>{
    try {
        const user =await Imports.hash.getUserFromHeader(req.headers.authorization);
        if(user.verfiedAt.trim()===""&&!user.changePassword){
            if(await Imports.user.findUserById(user._id)){
              return  next()
            //  next()
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