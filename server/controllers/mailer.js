import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';


// https://ethereal.email/create

let nodeconfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure:false,
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD
    }
}

let transporter = nodemailer.createTransport(nodeconfig);

let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
})


/** POST : http://localhost:8080/api/registerMail
 * @param:{
    "username":"emaple123",
    "userEmail":"admin123",
    "text":"admin123",
    "subject":"admin123"
 * }
*/
export const registerMail = async(req,res)=> {
    const {username, userEmail, text , subject} = req.body;

    //body of the Email
    var email = {
        body:{
            name:username,
            intro: text || 'Welcome to Daily Tution! We\'re very exited to have you on board,',
            outro: 'Need help, or have question? Just reply to this email, we\'d love to help.'
        }
    }

    var emailbody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Succesfully",
        html: emailbody
    }

    //send mail
    transporter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg : "You Should receive and email from us"})
        })
        .catch(error=> res.status(500).send({error}))
}




