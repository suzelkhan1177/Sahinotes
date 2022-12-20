const nodemailer = require('nodemailer');
const nodemailerObject = require('../config/nodemailer');

module.exports.accountCreated = (user) => {
      //fetching user from controller
    //__dirname this gives the current position

      var htmlString = nodemailerObject.renderTemplate(user, __dirname+'/../views/mailers/account_created_template.ejs');
      nodemailerObject.transporter.sendMail({
        from: 'suzelkhan46@gmail.com',
        to: user.email,
        subject: "Create Your New Account",
        html:  htmlString,

      }, function(err, data){
        if (err) {
         console.log('Error in sending email: ', err); return;
        }
        console.log('Mail sent successfully');
        return;
      });
}