const User = require("../models/users");
const bcryptjs = require('bcryptjs');
const forgetPasswordMailer = require('../mailers/forget_password_mailer');
const accountCreatedMailer = require('../mailers/account_created_mailer');
const queue = require('../workers/account_created_mailer');
const Note = require('../models/notes');
const Comment = require('../models/comments');
const fs = require('fs');
const env = require("../environment");

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

module.exports.uploadNotesPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("upload_notes");
  } else {
    res.render("signin");
  }

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
            accountCreatedMailer.accountCreated(user);
               if(err){ console.log(err); return; }
           })
           req.flash('success', 'Account Create Successfully');
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
  if (req.isAuthenticated()) {
    res.render("verify_mobile");
  } else {
    res.render("signin");
  }
};

module.exports.sendOtpMessage = (req, res) => {
  // send the otp message
  const mobilenumber = req.params.mobileNumber;
  console.log(req.params);
  const userEmail = req.user.email;

  console.log("OTP Controller");
  API_KEY = env.API_KEY_MOBILE;

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

module.exports.showSingleNotes = async (req, res) => {
  var userId = req.user.id;
    var user = await User.findById(userId);
    var file = req.params.x;
    var note = await Note.findOne({file: file});
    if (!user.viewedNotes.includes(note._id)) {
        console.log(user.viewedNotes);
        user.viewedNotes.push(note._id);
        note.views.push(userId);
        console.log(user.viewedNotes);
        note.save();
        user.save();
    }
    return res.render('notes', {
        filename: file
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
      return res.status(200).json({
        likes: note.likedUsers.length,
        views: note.views.length
    });
  })
}

module.exports.getComments = (req, res) => {
  //get all the comment for notes
  var file =  req.params.noteName;
  Note.findOne({file:file}, async (err, note) => {
      if(err) {console.log("fing notes get Comments:", err ); return; }
      
      var comment_response = {};
      var parent_comment_ids = note.comments;
        for(var i of parent_comment_ids){
            var parent_comment = await Comment.findById(i);
            comment_response[i] = {};
            comment_response[i]["text"] = parent_comment.text;
            comment_response[i]["child_comments"] = {};
            
            //find child comments
            for(var j of parent_comment.comments){
              var child_comment = await Comment.findById(j);
              comment_response[i]["child_comments"][j] = child_comment.id;
            }

         }

         console.log(comment_response);
         return res.status(200).json(comment_response);
  });

}

module.exports.addNewComments = async (req, res) => {
  // add new comments either a notes/comments

  var file = req.body.file;
  console.log(req.body);
  var userId = req.user.id;
  var text = req.body.text;
  var note = await Note.findOne({file: file});
  var noteId = note._id;
  var type = req.body.type;
  var comment = req.body.comment;

     var new_comment = await Comment.create({
            text: text,
            note: noteId,
            user: userId,
            type: type,
            comment: comment,
            comments: []
       });

       User.findById(userId, async function(err, user){
        if(err) {console.log("Error in finding user Addcomments"); return; }
        await user.comments.push(new_comment._id);
        await user.save();
     })

    if(type=="Notes"){
      Note.findById(noteId, async function(err, note){
        if(err) {console.log("Error in finding Note Addcomments"); return; }
        await note.comments.push(new_comment._id);
        await note.save();
     })
    }

    if(type=="Comments"){
      Comment.findById(new_comment.comment, async function(err, comment){
        if(err) {console.log("Error in finding parent comment Addcomments"); return; }
        await comment.comments.push(new_comment._id);
        await comment.save();
      })
    }

}

module.exports.deleteNotes = async (req, res) => {
   console.log("insaide controller");
       const  file = req.params.note_file;
       var note =  await Note.findOne({file: file});
       var author = await User.findById(note.user);
       var index = author.notes.indexOf(note._id);
       delete author.notes[index];
       author.save();

       var likedUsers = note.likedUsers;
       var viewedUsers = note.views;

       // delete like in User Schema
       for(var i =0; i<likedUsers.length; i++){
           var u = await User.findById(likedUsers[i]);
           var index  = u.likedNotes.indexOf(note._id);
           delete u.likedNotes[index];
       }

         // delete view in User Schema
         for(var i =0; i<viewedUsers.length; i++){
          var u = await User.findById(viewedUsers[i]);
          var index  = u.viewedUsers.indexOf(note._id);
          delete u.viewedUsers[index];
      }

      var parentComments = note.comments;

      for(var i=0; i<parentComments.length; i++){
        // find parent comment id
        var  x = await  Comment.findById(parentComments[i]);
        var childComments = x.comments;

            //delete child comment User Schema
        for(var j=0; j<childComments; j++){

            // find  child comment id
            var y = await  Comment.findById(childComments[j]);

            var u = await User.findById(y.user);
            var index  = u.comments.indexOf(y._id);
            delete  u.comments[index];  
            u.save();

            //delete child comment
            await Comment.findByIdAndDelete(y._id);  
        }

        var u = await  User.findById(x.user);
        var index =  u.comments.indexOf(u);
        delete u.comments[index];
        u.save();    

        await Comment.findByIdAndDelete(x._id);
      }

      await Note.findByIdAndDelete(note._id);
      fs.unlink(`../assets/uploads/${file}`, function(err) {
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });

}

