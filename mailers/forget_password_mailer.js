const nodemailer = require('nodemailer');
const nodemailerObject = require('../config/nodemailer');

module.exports.forgetPassword = (data) => {
    //fetching user from controller
   // var htmlString = nodemailerObject.renderTemplate(user, __dirname+'/../views/mailers/forget_password.ejs');
      
    nodemailerObject.transporter.sendMail({
      from: 'suzelkhan46@gmail.com',
        to: data.email,
        subject: "Resat Your Password",
        html: `<p>Click on this Link <a href="${data.url}">Resat Password !</a></p>`,

    }, function(err, data) {
        if (err) {console.log('Error in sending email: ', err); return;}
        console.log('Mail sent successfully');
        return;
    });
}