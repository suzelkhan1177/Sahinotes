const User = require("../models/users");
const bcryptjs = require('bcryptjs');
const accountCreatedMailer = require('../mailers/account_created_mailer');
const queue = require('../workers/account_created_mailer');
const Note = require('../models/notes');
const Comment = require('../models/comments');
const fs = require('fs');
const env = require("../environment");



module.exports.home = (req, res) =>{
  res.render("home");
}


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

