const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/likes_controller");

router.put('/like_notes/:noteName', usersController.likeNotes);
router.put('/dislike_notes/:noteName', usersController.DislikeNotes);
router.get('/get_number_of_likes/:noteName', usersController.numbersOfLikes);


module.exports = router;
