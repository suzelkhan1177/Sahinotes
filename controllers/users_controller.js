const User = require("../models/users");
const nodemailerObject = require('../config/nodemailer');

module.exports.user = (req, res) => {
  res.send("User page");
};

module.exports.profile = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile");
  } else {
    res.render("signin");
  }
};

module.exports.signin = (req, res) => {
  res.render("signin");
};

module.exports.signup = (req, res) => {
  res.render("signup");
};

module.exports.create = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("/users/signup");
  }
  //search if this is a new user or an old one
  // if new user -> create user -> send to sign in page
  // if old user -> send to sign in page
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user in create controller: ", err);
      return res.redirect("back");
    }
    // if condition is true if user==null/undefined which means no prevous entry

    if (!user) {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
        (err, user) => {
          if (err) {
            console.log("Error is Creating user is create controller: ", err);
            return res.redirect("back");
          }

          return res.redirect("/users/signin");
        }
      );
    } else {
      return res.redirect("/users/signin");
    }
  });
};

module.exports.createSession = (req, res) => {
  return res.redirect("/users/profile");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log("Error is LogOut", err);
      return;
    }
  });
  return res.redirect("/users/signin");
};

module.exports.verifyMobile = (req, res) => {
  res.render("verify_mobile");
};

module.exports.sendOtpMessage = (req, res) => {
  // send the otp message
  const mobilenumber = req.params.mobileNumber;
  console.log(req.params);
  const userEmail = req.user.email;

  console.log("OTP Controller");
  API_KEY =
    "iI29zBShf0RrV7gPQdTEH8vnGKjkbZuLtWXsYyUDwaAq64eCcmgLKvU3W9C47NxPkDamJ0MblFV2cE5u";

  const fast2sms = require("fast-two-sms");
  const otp = Math.floor(Math.random() * 9000) + 1000;

  var options = {
    authorization: API_KEY,
    message: `Your OTP is ${otp}`,
    numbers: [mobilenumber],
  };

  async function sendOtpMessage() {
    var res = true;   // await fast2sms.sendMessage(options);
    if (res) {
        console.log(res);
        User.findOneAndUpdate({email: userEmail}, {mobileOtp: otp}, function(err, user) {
            if (err) {console.log('Error in saving otp: ', err); return;}
            user.save();
        });
    } else {
        console.log('balance over');
    }
}
  sendOtpMessage();
console.log('hello world');

  // fast2sms
  //   .sendMessage(options)
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

module.exports.verifyOtp = (req, res) => {
   
     var obj = JSON.parse(req.params.obj);
     var mobileNumber = obj.mobileNumber;
     var otp = obj.otp;
     var useEmail = req.user.email;
   User.findOneAndUpdate({email:useEmail}, {mobile: mobileNumber, mobileOtp: ""}, function(err, user){ 
         if (err) {console.log('Error in verifying otp: ', err); return;}
        user.save();
 });
    
      console.log('mobile number verified');
      return res.redirect('/users/profile');
}
