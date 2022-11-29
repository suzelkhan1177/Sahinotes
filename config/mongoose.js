const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sahinotes_development');

const db = mongoose.connection;

db.on('error', function(){
    console.log("error is Connecting to tha database");
})

db.once('open', function(){
   console.log("Connected to the Database");
});

module.exports = db;