const nodemailer = require("nodemailer")
const env = require("./env");
try {
   // //console.log(env);
    const mailer = nodemailer.createTransport({
        service:env.SMTP_SERVICE,
        
        auth:{
            user:env.SMTP_USERNAME,
            pass:env.SMTP_PASSWORD
        }
    
    });
    
    mailer.verify()
    .then(res=>{
        console.log("Mailer Working");
    })
    .catch(err=>{
        console.log(err);
        process.exit(-1)
    })
    module.exports = mailer
} catch (err) {
    console.log(err);
        process.exit(-1)
}

