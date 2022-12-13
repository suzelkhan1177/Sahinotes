const nodemailer = require('nodemailer');

module.exports.forgetPassword = (data) => {

      nodemailer.transporter.sendMail({
        from: 'suzelkhan46@gmail.com',
        to: data.email,
        subject: "Create Your New Account",
        html: '<h3>Hello, welcome with your new account!</h3>'

      }, function(err, data){
        if (err) {
         console.log('Error in sending email: ', err); return;
        }
        console.log('Mail sent successfully');
        return;
      });
}