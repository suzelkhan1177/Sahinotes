const User = require("../models/users");
const bcryptjs = require('bcryptjs');
const forgetPasswordMailer = require('../mailers/forget_password_mailer');


module.exports.forgetPassword = (req, res) => {
    res.render("forget_password");
  };
  
  module.exports.updatePassword = (req, res) => {
    res.render("update_password");
  };



module.exports.forget_password_post = (req, res) => {

    var email = req.body.email;
    var token = Math.floor(Math.random() * 9000) + 1000;
    var accessToken = email + token;
    User.findOneAndUpdate({email: email}, {accessToken: accessToken}, function(err, user) {
     if (err) {console.log('Error find User in forget Password: ', err); return;}
     if(!user) {
         console.log('User not Found');
         req.flash('error', 'Email Id Not Registered');
         return res.redirect('/users/forget_password');

     }else{
       user.save();
       var obj = {};
       obj.email = user.email;
       obj.url = `http://localhost:8000/users/forget_&_update_password/update_password?accessToken=${accessToken}`
      forgetPasswordMailer.forgetPassword(obj);
       req.flash('success', 'Mail Send Successfully');
       return res.redirect('/users/signin');
     }
 });
}

module.exports.update_password_post = (req, res) => {

 var password = req.body.password;
 var confirm_password = req.body.confirm_password;
 var accessToken = req.body.accessToken;
 console.log(password, confirm_password, accessToken);

 if (password!=confirm_password) {

   req.flash('error', 'Password or Confirm Password Not Match');
   console.log('passwords dont match');
   return res.redirect('back');
} else {


var email = accessToken.substring(0, accessToken.length-4);
console.log(email);

User.findOne({email: email}, function(err, user) {
 if (err) {console.log('Error in finding user: ', err); return;}
    
     if(accessToken == user.accessToken){
       bcryptjs.genSalt(12, (err, salt) => {
         if (err) throw err;
         // hash the password
         bcryptjs.hash(password, salt, (err, hash) => {
             if (err) throw err;
       
         User.findOneAndUpdate({email: email}, {password: hash, accessToken: null}, function(err, user) {
           if (err) {console.log('Error in finding user: ', err); return;}
           user.save();
       });
 
          });
     });
 
     }
});
req.flash('success', 'Update Password Successfully');
   return res.redirect('/users/signin');
}

}