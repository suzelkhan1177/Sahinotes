const nodemailer = require("nodemailer");
const ejs = require("ejs");


let transporter = nodemailer.createTransport({
    // we are using the createTransport function from nodemailer
    //configurations for sending email
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "suzelkhan46@gmail.com",
    pass: "lvarpjtlioxxqxha",
  },
});


let renderTemplate = function(data, relativePath){
     //here we are not using anything from the nodemailer library
    // data is any user specific data that you want to send to the mailer template
    // relativePath is the name of the template file inside mailers folder in the views folder
   
      var templateToBeReturned;
    ejs.renderFile(relativePath , data , function(err, template){
    if (err) {console.log('Error in rendering email: ', err); return;}
    templateToBeReturned =  template;
    });

  return templateToBeReturned;
   
}

module.exports = {
    transporter : transporter,
    renderTemplate: renderTemplate
}
