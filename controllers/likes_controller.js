const User = require("../models/users");
const Note = require('../models/notes');

module.exports.likeNotes = (req, res) => {
    var userId = req.user.id;
    var noteName = req.params.noteName;
    User.findById(userId, async (err, user) => {
        if (err) {console.log('Error in finding user in likeNotes: ', err); return;}
        try {
            // console.log("noteName = ",noteName);
            var note = await Note.findOne({file: noteName});
            if (!user.likedNotes.includes(note._id)) {
                user.likedNotes.push(note._id);
            }
            if (!note.likedUsers.includes(userId)) {
                note.likedUsers.push(userId);
            }
            note.save();
            user.save();
        } catch(err) {
            console.log('error in finding not in likeNotes: ', err);
        }
    });
  }

  module.exports.DislikeNotes = (req, res) => {
    var userId = req.user.id;
    var noteName = req.params.noteName;
    User.findById(userId, async (err, user) => {
        if (err) {console.log('Error in finding user in likeNotes: ', err); return;}
        try {
            // console.log("noteName = ",noteName);
            var note = await Note.findOne({file: noteName});
            if (user.likedNotes.includes(note._id)) {
                user.likedNotes.remove(note._id);
            }
            if (note.likedUsers.includes(userId)) {
                note.likedUsers.remove(userId);
            }
            note.save();
            user.save();
        } catch(err) {
            console.log('error in finding not in likeNotes: ', err);
        }
    });
  }
  
  module.exports.numbersOfLikes = (req, res) => {
    var noteName = req.params.noteName;
    Note.findOne({file: noteName}, (err, note) => {
        if (err) {console.log(err); return;}
        return res.status(200).json({
          likes: note.likedUsers.length,
          views: note.views.length
      });
    })
  }