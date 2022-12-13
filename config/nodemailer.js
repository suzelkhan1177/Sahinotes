const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "suzelkhan46@gmail.com",
    password: "SuzelK1177@",
  },
});


let renderTemplate = function(data, relativePath){
 // data is any user specific data that you want to send to the mailer template
 // relativePath is the name of the template file inside mailers folder in the views folder
 ejs.renderFile('../views/mailers'+relativePath , data , function(err, template){
    if (err) {console.log('Error in rendering email: ', err); return;}
    return template;
 });
   
}

module.exports = {
    transporter : transporter,
    renderTemplate: renderTemplate
}
