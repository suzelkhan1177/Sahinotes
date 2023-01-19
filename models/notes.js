const mongoose = require('mongoose');
const multer = require('multer');

const noteSchema = new mongoose.Schema({
   name: {type: String, require: true},
   about: {type: String, require: true},
   file: {type: String, require: true},
   user: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'User'},
   likedUsers:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'User'}],
   comments:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'Comment'}]
},{

    timestamps: true
});

//we need to tell multer 2 things --
// 1. where to store the file
// 2. what is the name of the stored file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/../uploads/notes');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '_' + Date.now());
    }
});

noteSchema.statics.uploadedFile = multer({ storage: storage}).single('notes');

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
