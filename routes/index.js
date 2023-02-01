const express = require('express');
const router = express.Router();

const homeController = require('../controllers/users_controller');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/users/forget_&_update_password',require('./forget_&_update_password') );

console.log("Router is Runing");
module.exports = router;