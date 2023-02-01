const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);
router.get("/signin", usersController.signin);
router.get("/signup", usersController.signup);
router.get("/verify_mobile", usersController.verifyMobile);
router.get("/upload_notes_page", usersController.uploadNotesPage);


router.post("/create", usersController.create);
//called create during signup and then redirected to sign in page
router.post(
  "/create_session",
  passport.authenticate("local", { failureRedirect: "/users/signin", failureFlash: 'Login not successful Please check email id and Password' }),
  usersController.createSession
);
//called create session during signin and thenr edirected to profile page

router.get("/logout", usersController.logout);

//in both signup and signin, we will call createsession and redirect to profile page

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}) ,usersController.createSession );
router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/users/signin', failureFlash: 'Login not successful'} ) ,usersController.createSession );

router.get('/send_otp_message/:mobileNumber', usersController.sendOtpMessage);
router.get('/verify_otp/:obj', usersController.verifyOtp);
router.get('/forget_password',usersController.forgetPassword);
router.get('/update_password',usersController.updatePassword);

router.post('/forget_password',usersController.forget_password_post);
router.post('/update_password',usersController.update_password_post);
router.post('/upload_notes', usersController.uploadNotes);

router.get('/show_all_notes',usersController.showAllNotes);
router.get('/show_single_notes/:x',usersController.showSingleNotes);
router.put('/like_notes/:noteName', usersController.likeNotes);
router.get('/get_number_of_likes/:noteName', usersController.numbersOfLikes);
router.post('/new_note_comment', usersController.addNewComments);
router.get('/get_all_comments/:noteName', usersController.getComments);
router.delete('/delete_note/:note_file', usersController.deleteNotes);


module.exports = router;
