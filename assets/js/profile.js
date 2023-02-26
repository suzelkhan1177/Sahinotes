
// var btn  = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');
var url = window.location.href;
var profile_id = url.substring(url.indexOf('profile/')+8);

function removeChildElements(htmlElement){
   while(htmlElement.firstChild) {
   htmlElement.removeChild(htmlElement.firstChild);
   }
}

window.addEventListener('load', () => {
  console.log("Profile id",profile_id);
     fetch(`/users/notes/show_all_notes/${profile_id}`)
     .then((response) => response.json())
     .then((notes) => {
       console.log(notes);
       removeChildElements(notes_view);
       for(let i=0; i<notes.length; i++) {
              var new_div = document.createElement('div');
              var new_notes_id = document.createElement('p');
              new_notes_id.innerHTML = notes[i].name;
             new_div.appendChild(new_notes_id);
             new_div.style.border = '1px solid black';
             let  filename =notes[i].file;    
             new_notes_id.addEventListener('click', (e) => {
                   console.log(e.target);
                 window.location  = `/users/notes/show_single_notes/${filename}`;
             });
             var delete_button = document.createElement('button');
             delete_button.innerHTML = 'delete';
             delete_button.setAttribute('id', notes[i].file);
             console.log(notes[i].file);
             new_div.appendChild(delete_button);
             delete_button.addEventListener('click', (e) => {

                 var name = e.target.getAttribute('id');
                 fetch(`/users/delete_note/${name}`, { method: 'DELETE' })
                 .then(() => console.log('Delete successful'));

                 new Noty({
                  theme: "relax",
                  type: "success",
                  text: "Delete Note Successfully!!",
                  layout: "topCenter",
                  timeout: 3000,
                }).show();
             })
             new_notes_id.style.cursor = 'pointer';
             notes_view.appendChild(new_div);

       }
     })
     .catch((err) => console.log(err));
   
});

var users_view = document.getElementById('users_view');
window.addEventListener('load', () => {
  fetch('/users/get_all_users')
  .then((response) => response.json())
  .then((users) => {
    console.log(users);
    removeChildElements(users_view);
    for (var i=0; i<users.length; i++) {
      var list_item = document.createElement('p');
      list_item.innerHTML = users[i].name;
      list_item.setAttribute('id', users[i].id);
      list_item.style.cursor = 'pointer';
      list_item.addEventListener('click', function(e) {
        var id = e.target.getAttribute('id');
        window.location.href = `/users/profile/${id}`;
      });
      console.log(users_view);
      users_view.appendChild(list_item);
  }
  })
  .catch((err) => console.log(err));

});



// var logged_in_user_id = document.getElementById('logged_in_user_id');
// console.log(logged_in_user_id);
// logged_in_user_id.style.display = 'none';
// logged_in_user_id = logged_in_user_id.innerHTML;
// if (logged_in_user_id!=profile_id) {
//   upload_form.style.display = 'none';
// }