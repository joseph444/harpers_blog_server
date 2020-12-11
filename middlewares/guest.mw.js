module.exports=(req,res,next)=>{
    try {
        if(!req.headers.authorization){
            next();
        }else{
            return res.json({
                status:false,
                message:"Unauthorized",
                errorType:"UNAUTHROZIED",
                error:"unauthorized user"
            })
        }
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