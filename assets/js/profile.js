
var btn  = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');

btn.addEventListener('click', () => {
     fetch('/users/show_all_notes')
     .then((response) => response.json())
     .then((notes) => {
       console.log(notes);
       for(var i=0; i<notes.length; i++) {
              var new_div = document.createElement('div');
              var new_notes_id = document.createElement('p');
              new_notes_id.innerHTML = notes[i].name;
             new_div.appendChild(new_notes_id);
             new_div.style.border = '1px solid black';
             var  filename =notes[i].file;    
             new_notes_id.addEventListener('click', (e) => {
                   console.log(e.target);
                 window.location  = `/users/show_single_notes/${filename}`;
             });
             new_notes_id.style.cursor = 'pointer';
             notes_view.appendChild(new_div);

       }
     })
     .catch((err) => console.log(err));
   
});