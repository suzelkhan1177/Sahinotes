
var btn  = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');

function removeChildElements(htmlElement){
   while(htmlElement.firstChild) {
   htmlElement.removeChild(htmlElement.firstChild);
   }
}

btn.addEventListener('click', () => {
     fetch('/users/notes/show_all_notes')
     .then((response) => response.json())
     .then((notes) => {
       console.log(notes);
       removeChildElements(notes_view);
       for(var i=0; i<notes.length; i++) {
              var new_div = document.createElement('div');
              var new_notes_id = document.createElement('p');
              new_notes_id.innerHTML = notes[i].name;
             new_div.appendChild(new_notes_id);
             new_div.style.border = '1px solid black';
             var  filename =notes[i].file;    
             new_notes_id.addEventListener('click', (e) => {
                   console.log(e.target);
                 window.location  = `/users/notes/show_single_notes/${filename}`;
             });
             var delete_button = document.createElement('button');
             delete_button.innerHTML = 'delete';
             delete_button.setAttribute('id', notes[i].file);
             new_div.appendChild(delete_button);
             delete_button.addEventListener('click', (e) => {
                 var name = e.target.getAttribute('id');
                 fetch(`/users/delete_note/${name}`, { method: 'DELETE' })
                 .then(() => console.log('Delete successful'));
             })
             new_notes_id.style.cursor = 'pointer';
             notes_view.appendChild(new_div);

       }
     })
     .catch((err) => console.log(err));
   
});