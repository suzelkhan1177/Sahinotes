const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
   name: {type: String, require: true},
   file: {type: String, require: true},
   user: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'User'}
},{

    timestamps: true
});

const Note = mongoose.model("User", noteSchema);

module.exports = Note;
