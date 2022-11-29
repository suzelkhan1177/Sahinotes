const express = require("express");
const passport = require("passport");
const router = express.Router();

const profileController = require("../controllers/users_controller");

router.get("/profile", profileController.profile);
router.get("/signin", profileController.signin);
router.get("/signup", profileController.signup);

router.post("/create", profileController.create);
//called create during signup and then redirected to sign in page
router.post(
  "/create_session",
  passport.authenticate("local", { failureRedirect: "/users/signin" }),
  profileController.createSession
);
//called create session during signin and thenr edirected to profile page

router.get("/logout", profileController.logout);

//in both signup and signin, we will call createsession and redirect to profile page

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}) ,profileController.createSession );
router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/users/signin'} ) ,profileController.createSession );

module.exports = router;
