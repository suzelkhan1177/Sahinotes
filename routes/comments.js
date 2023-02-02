const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comments_controller");


router.post('/new_note_comment', commentController.addNewComments);
router.get('/get_all_comments/:noteName', commentController.getComments);


module.exports = router;
