const User = require("../models/users");
const Note = require('../models/notes');
const Comment = require('../models/comments');




module.exports.getComments = (req, res) => {
    //get all the comment for notes
    var file =  req.params.noteName;
    Note.findOne({file:file}, async (err, note) => {
        if(err) {console.log("fing notes get Comments:", err ); return; }
        
        var comment_response = {};
        var parent_comment_ids = note.comments;
          for(var i of parent_comment_ids){
              var parent_comment = await Comment.findById(i);
              comment_response[i] = {};
              comment_response[i]["text"] = parent_comment.text;
              comment_response[i]["child_comments"] = {};
              
              //find child comments
              for(var j of parent_comment.comments){
                var child_comment = await Comment.findById(j);
                comment_response[i]["child_comments"][j] = child_comment.id;
              }
  
           }
  
           console.log(comment_response);
           return res.status(200).json(comment_response);
    });
  
  }
  
  module.exports.addNewComments = async (req, res) => {
    // add new comments either a notes/comments
  
    var file = req.body.file;
    console.log(req.body);
    var userId = req.user.id;
    var text = req.body.text;
    var note = await Note.findOne({file: file});
    var noteId = note._id;
    var type = req.body.type;
    var comment = req.body.comment;
  
       var new_comment = await Comment.create({
              text: text,
              note: noteId,
              user: userId,
              type: type,
              comment: comment,
              comments: []
         });
  
         User.findById(userId, async function(err, user){
          if(err) {console.log("Error in finding user Addcomments"); return; }
          await user.comments.push(new_comment._id);
          await user.save();
       })
  
      if(type=="Notes"){
        Note.findById(noteId, async function(err, note){
          if(err) {console.log("Error in finding Note Addcomments"); return; }
          await note.comments.push(new_comment._id);
          await note.save();
       })
      }
  
      if(type=="Comments"){
        Comment.findById(new_comment.comment, async function(err, comment){
          if(err) {console.log("Error in finding parent comment Addcomments"); return; }
          await comment.comments.push(new_comment._id);
          await comment.save();
        })
      }
  
  }