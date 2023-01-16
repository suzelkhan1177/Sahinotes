const passport = require('passport');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new localStrategy({usernameField: 'email'}, function(email, password, done) {
    User.findOne({email: email}, (err, user) => {
   
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: "User Doesn't Exist !" });
        }
        bcryptjs.compare(password, user.password, (err, match) => {
            if (err) {
                return done(null, false);
            }
            if (!match) {
                return done(null, false, { message: "Password Doesn't match !" });
            }
            if (match) {
                return done(null, user);
            }
        })

    //     if (err) {console.log('Error in finding user in passport: ', err); return done(err, false);}
    //     if (!user || password!=user.password) {
    //         console.log('Invalid email or password');
    //         return done(null, false);
    //     }
    //     return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {console.log('Error in deserializeUser: ', err);
            return done(err);
        }
        return done(null, user);
    });
});

module.exports = passport;