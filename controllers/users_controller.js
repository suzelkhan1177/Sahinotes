const User = require("../models/users");

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
  req.logout(function(err) {
    if(err) {
      console.log("Error is LogOut", err);
       return;
    }
  });
  return res.redirect("/users/signin");
};
