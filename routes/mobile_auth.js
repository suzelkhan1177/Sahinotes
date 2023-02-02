const express = require("express");
const router = express.Router();

const mobileAuthsController = require("../controllers/mobile_auth_controller");



router.get("/verify_mobile", mobileAuthsController.verifyMobile);

router.get('/send_otp_message/:mobileNumber', mobileAuthsController.sendOtpMessage);
router.get('/verify_otp/:obj', mobileAuthsController.verifyOtp);


module.exports = router;
