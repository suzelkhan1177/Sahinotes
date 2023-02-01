const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    name: {type: String, require: true},
    mobileOtp: {type: String},
    mobile: {type: String},
    accessToken: {type: String, default: null},
    notes: [{type : mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    likedNotes:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'Note'}],
    comments:[{type: mongoose.Schema.Types.ObjectId ,  ref: 'Comment'}],
    viewedNotes: [{type : mongoose.Schema.Types.ObjectId, ref: 'Note'}],
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;