const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comments_controller");


router.post('/new_note_comment', commentController.addNewComments);
router.delete('/delete_note_comment/:fileName', commentController.deleteNewComments);
router.delete('/delete_child_note_comment/:comment_id', commentController.deleteChildComments);
router.get('/get_all_comments/:noteName', commentController.getComments);


module.exports = router;
