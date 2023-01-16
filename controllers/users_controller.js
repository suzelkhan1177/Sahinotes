const User = require("../models/users");
const bcryptjs = require('bcryptjs');
const forgetPasswordMailer = require('../mailers/forget_password_mailer');
const queue = require('../workers/account_created_mailer');
const Note = require('../models/notes');

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


module.exports.forgetPassword = (req, res) => {
  res.render("forget_password");
};

module.exports.updatePassword = (req, res) => {
  res.render("update_password");
};

module.exports.create = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Password or Confirm Password Not Match');
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

      bcryptjs.genSalt(12, (err, salt) => {
        if (err) throw err;
        // hash the password
        bcryptjs.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
      
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: hash,
        },
        (err, user) => {
          if (err) {
            console.log("Error is Creating user is create controller: ", err);
            return res.redirect("back");
          }

             // i should send the email(user.email)
            //  accountCreatedMailer.accountCreated(user);

           //call the worker hare
           queue.create('emails', user).save(function(err) {
               if(err){ console.log(err); return; }
           })

          return res.redirect("/users/signin");
        }
      );

    });
  });

    } else {
      req.flash('error', 'Email ID already Registered');
      return res.redirect("/users/signin");
    }
  });
};

module.exports.createSession = (req, res) => {
  req.flash('success', 'Login Successfully');
  return res.redirect("/users/profile");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log("Error is LogOut", err);
      return;
    }
  });
   req.flash('success', 'Log Out Successfully');
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
  const OTP = Math.floor(Math.random() * 9000) + 1000;

  var options = {
    authorization: API_KEY,
    message: `Your OTP is ${OTP}`,
    numbers: [mobilenumber],
  };

  async function sendOtpMessage() {
    var res = true;   // await fast2sms.sendMessage(options);
    if (res) {
      console.log(res);
      User.findOneAndUpdate({email: userEmail}, {mobileOtp: OTP}, function(err, user) {
          if (err) {console.log('Error in saving otp: ', err); return;}
          user.save();
          var id = setTimeout(function(OTP) {
              User.findOne({email: userEmail}, function(err, user){
                  if (err) {return;}
                  if (user.mobileOtp==OTP) {
                      User.findOneAndUpdate({email: userEmail, mobileOtp: ""}, function(err, user) {});
                  }
              });
          }, 1*60*1000);
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

 if(otp == req.user.mobileOtp){
 User.findOneAndUpdate({email:useEmail}, {mobile: mobileNumber, mobileOtp: ""}, function(err, user){ 
         if (err) {console.log('Error in verifying otp: ', err); return;}
        user.save();
 });
 req.flash('success', 'Verify Number Successfully');
 console.log('mobile number verified');
 return res.redirect('/users/profile');

}else{

     User.findOneAndUpdate({email: useEmail}, function(err, user){});
     req.flash('error', 'OTP Invalid');
    console.log("OTP Invalid");
    return res.redirect('back');
}
    
}

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
        obj.url = `http://localhost:8000/users/update_password?accessToken=${accessToken}`
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
        User.findOneAndUpdate({email: email}, {password: password, accessToken: null}, function(err, user) {
          if (err) {console.log('Error in finding user: ', err); return;}
          user.save();
      });
      }
});
req.flash('success', 'Update Password Successfully');
    return res.redirect('/users/signin');
}

}

module.exports.uploadNotes = (req, res) => {

      var id = req.user.id;
      console.log(id);

      Note.create({
        name : req.body.name,
        about: req.body.about,
        file: "",
        user: id

      }, function(err, note){
             if(err){ console.log('Error in creating new notes :', err);}
             //statics function cannot be called via object but just via schema
             Note.uploadedFile(req, res, function(err){
              if(err) {console.log('Error in saving file: ', err); return;}
              
              if(req.file){
                  note.file = req.file.filename;
                  note.name = req.body.name;
                  note.about= req.body.about; 
                  note.save();
                  User.findById(id , function(err, user){
                    if (err) {console.log('Error in adding file to user: ', err); return;}

                     user.notes.push(note.id);
                     user.save();
                  })
              }
                  
             });
      });
       
      req.flash('success', 'File Uploded Successfully');
      return res.redirect('profile');
}

module.exports.showAllNotes = (req, res) =>{

     var id = req.user.id;
     User.findById(id, async (err, user) => {
         
         if(err){ console.log('Error is finding user in show_notes :', err); return;}
         var notesids = user.notes;
         var result = [];
         for(var i=0; i<notesids.length; i++){
            //    Note.findById(notesids[i], (err, notes) => {
            //       result.push(notes);
            //  });

            try{
            var note = await Note.findById(notesids[i]);
            result.push(note);
            }catch (err){
              console.log('Error in finding notes :', err);
            }
         }
  console.log(result.length);
       return   res.status(200).json(result);
     })
}

module.exports.showSingleNotes = (req, res) => {
  var filename = req.params.x;
    return res.render('notes', {
        filename: filename
    });
};

module.exports.likeNotes = (req, res) => {
  var userId = req.user.id;
  var noteName = req.params.noteName;
  User.findById(userId, async (err, user) => {
      if (err) {console.log('Error in finding user in likeNotes: ', err); return;}
      try {
          console.log("noteName = ",noteName);
          var note = await Note.findOne({file: noteName});
          if (!user.likedNotes.includes(note._id)) {
              user.likedNotes.push(note._id);
          }
          if (!note.likedUsers.includes(userId)) {
              note.likedUsers.push(userId);
          }
          note.save();
          user.save();
      } catch(err) {
          console.log('error in finding not in likeNotes: ', err);
      }
  });
}

module.exports.numbersOfLikes = (req, res) => {
  var noteName = req.params.noteName;
  Note.findOne({file: noteName}, (err, note) => {
      if (err) {console.log(err); return;}
      return res.status(200).json(note.likedUsers.length);
  })
}

