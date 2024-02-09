const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config();

const ServerEmail = process.env.ServerEmail;
const ServerPassword = process.env.ServerPassword;

const sendOTPmail = function(email ,  otp){
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : ServerEmail,
            pass : ServerPassword
        }
    })
    
    const mailOptions = {
        from : ServerEmail,
        to : email,
        subject : `FURNIX`,
        text : `Hello  ${email}
its from FURNIX furniture your OTP is
${otp}`
    };
    
    
    transporter.sendMail(mailOptions , (error , info)=>{
        if(error){
            console.log("OTP not send" , error);
        }else{
            console.log("OTP send to mail" , info.response);
        }
    })
}


module.exports = sendOTPmail;