const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);
router.get("/signin", usersController.signin);
router.get("/signup", usersController.signup);
router.get("/verify_mobile", usersController.verifyMobile);

router.post("/create", usersController.create);
//called create during signup and then redirected to sign in page
router.post(
  "/create_session",
  passport.authenticate("local", { failureRedirect: "/users/signin" }),
  usersController.createSession
);
//called create session during signin and thenr edirected to profile page

router.get("/logout", usersController.logout);

//in both signup and signin, we will call createsession and redirect to profile page

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}) ,usersController.createSession );
router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/users/signin'} ) ,usersController.createSession );

router.get('/send_otp_message/:mobileNumber', usersController.sendOtpMessage);
router.get('/verify_otp/:obj', usersController.verifyOtp);
router.get('/forget_password',usersController.forgetPassword);
router.get('/update_password',usersController.updatePassword);

router.post('/forget_password',usersController.forget_password_post);
router.post('/update_password',usersController.update_password_post);

module.exports = router;
