const nodemailer = require("nodemailer")
require("dotenv").config()

async function sendMail(options) {
const transporter = nodemailer.createTransport({

 service:process.env.service,

  auth: {
    user: process.env.user,
    pass: process.env.emailPassword,
   
  },
});
 


  const mailOption = await transporter.sendMail({
    from: process.env.user, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    html: options.html, // html body
  });

await transporter.sendMail(mailOption, (error)=>{
  if (error) {
   return res.status(500).json({
    error: 'Error sending verification email' + error.message
   })
  }else{
    return res.status(200).json({
      message: 'Verification email sent'
    })
  }

})
 
}
module.exports = sendMail
