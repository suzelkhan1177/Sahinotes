const express = require("express");
const router = express.Router();

const forgetUpadatePasswordController = require("../controllers/forget_&_update_password");


router.get('/forget_password', forgetUpadatePasswordController.forgetPassword);
router.get('/update_password', forgetUpadatePasswordController.updatePassword);

router.post('/forget_password',  forgetUpadatePasswordController.forget_password_post);
router.post('/update_password',  forgetUpadatePasswordController.update_password_post);

module.exports=router;