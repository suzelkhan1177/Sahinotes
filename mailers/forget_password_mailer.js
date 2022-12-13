const nodemailer = require('nodemailer');

module.exports.forgetPassword = (data) => {

      nodemailer.transporter.sendMail({
        from: 'suzelkhan46@gmail.com',
        to: data.email,
        subject: "Reset Your Password",
        html: '<h3>Click on the link to reset your password</h3>'

      }, function(err, data){
        if (err) {
         console.log('Error in sending email: ', err); return;
        }
        console.log('Mail sent successfully');
        return;
      });
}