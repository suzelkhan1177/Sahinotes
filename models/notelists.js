const mongoose = require('mongoose');

const noteListSchema = new mongoose.Schema({
    name: {type: String, require: true},
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User'},
}, {
    timestamps: true
});

const Notelist = mongoose.model('Notelist', noteListSchema);

module.exports = Notelist