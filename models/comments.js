const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    text: {type: String, require: true},
    note: {type: mongoose.Schema.Types.ObjectId, ref: 'Note'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Note'},
    type: {type: String, require: true, enum: ["Comments", "Notes"]},
    comment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;