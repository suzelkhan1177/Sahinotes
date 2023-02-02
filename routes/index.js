const express = require('express');
const router = express.Router();

const homeController = require('../controllers/users_controller');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/users/forget_&_update_password',require('./forget_&_update_password') );
router.use('/users/notes',require('./notes') );
router.use('/users/toggle',require('./likes') );
router.use('/users/toggle',require('./comments') );
router.use('/users/mobile_auth',require('./mobile_auth') );


console.log("Router is Runing");
module.exports = router;