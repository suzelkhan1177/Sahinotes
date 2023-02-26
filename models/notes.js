const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
   name: {type: String, require: true},
   about: {type: String, require: true},
   file: {type: String, require: true},
   user: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'User'},
   likedUsers:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'User'}],
   comments:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'Comment'}],
   views: [{type : mongoose.Schema.Types.ObjectId, ref: 'Note'}],
},{

    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
