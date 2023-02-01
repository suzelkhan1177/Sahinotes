const User = require("../models/users");
const Note = require('../models/notes');



module.exports.uploadNotesPage = (req, res) => {
    if (req.isAuthenticated()) {
      res.render("upload_notes");
    } else {
      res.render("signin");
    }
  
  };

  module.exports.showAllNotes = (req, res) =>{

    var id = req.user.id;
    User.findById(id, async (err, user) => {
        
        if(err){ console.log('Error is finding user in show_notes :', err); return;}
        var notesids = user.notes;
        var result = [];
        for(var i=0; i<notesids.length; i++){
           //    Note.findById(notesids[i], (err, notes) => {
           //       result.push(notes);
           //  });

           try{
           var note = await Note.findById(notesids[i]);
           result.push(note);
           }catch (err){
             console.log('Error in finding notes :', err);
           }
        }
 console.log(result.length);
      return   res.status(200).json(result);
    })
}

module.exports.showSingleNotes = async (req, res) => {
 var userId = req.user.id;
   var user = await User.findById(userId);
   var file = req.params.x;
   var note = await Note.findOne({file: file});
   if (!user.viewedNotes.includes(note._id)) {
       console.log(user.viewedNotes);
       user.viewedNotes.push(note._id);
       note.views.push(userId);
       console.log(user.viewedNotes);
       note.save();
       user.save();
   }
   return res.render('notes', {
       filename: file
   });
};



module.exports.uploadNotes = (req, res) => {

    var id = req.user.id;
    console.log(id);

    Note.create({
      name : req.body.name,
      about: req.body.about,
      file: "",
      user: id

    }, function(err, note){
           if(err){ console.log('Error in creating new notes :', err);}
           //statics function cannot be called via object but just via schema
           Note.uploadedFile(req, res, function(err){
            if(err) {console.log('Error in saving file: ', err); return;}
            
            if(req.file){
                note.file = req.file.filename;
                note.name = req.body.name;
                note.about= req.body.about; 
                note.save();
                User.findById(id , function(err, user){
                  if (err) {console.log('Error in adding file to user: ', err); return;}

                   user.notes.push(note.id);
                   user.save();
                })
            }
                
           });
    });
     
    req.flash('success', 'File Uploded Successfully');
    return res.redirect('/users/profile');
}