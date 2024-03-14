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
        from: ServerEmail,
        to: email,
        subject: 'FURNIX',
        html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi ${email},</p>
                    <p>This message from FURNIX. Use the following OTP to complete your register procedures. OTP is valid for 1 minutes</p>
                    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    <p style="font-size: 0.9em;">Regards,<br />Furnix</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
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