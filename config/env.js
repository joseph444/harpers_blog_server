if(!process.env.PORT){
    result = require("dotenv").config();
    if(result.error){
        console.log(result.error);
        process.exit(-1)
    }
}



module.exports={
    ...process.env
}