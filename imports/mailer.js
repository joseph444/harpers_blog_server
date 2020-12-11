const config = require("../config")

module.exports={
    sendMail:function(to,subject,text){
        
        try {
            const from = config.env.SMTP_USERNAME;
            var mail = {
                from,
                to,
                subject,
                text
            }
            config.smtp.sendMail(mail,function(err,info){
                if(err){
                    throw "Mail not sent"
                }else{
                    console.log("Email Sent: "+info.response);
                }
            });
            
        } catch (error) {
            console.log(error);
            throw "Some Error Occured at sendMail"
        }
    }
}