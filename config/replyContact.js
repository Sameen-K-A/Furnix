const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config();

const ServerEmail = process.env.ServerEmail;
const ServerPassword = process.env.ServerPassword;

const replyContact = function(email ,  message){
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
                <div style="margin: 10px auto; width: 80%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi ${email},</p>
                    <p>${message}</p>
                    <p style="font-size: 0.9em;">Regards,<br />Furnix</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
    };
    
    
    
    transporter.sendMail(mailOptions , (error , info)=>{
        if(error){
            console.log("Contact reply not send" , error);
        }else{
            console.log("Contact reply send to mail" , info.response);
        }
    })
}


module.exports = replyContact;