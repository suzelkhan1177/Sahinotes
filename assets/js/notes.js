var like_button = document.getElementById('like_button');
var note_name = document.getElementById('note_name').innerHTML;
var views = document.getElementById('views');
var note_id = document.getElementById('note_id');
note_id.style.display = 'none';

fetch(`/users/toggle/get_number_of_likes/${note_name}`)
.then((response) => response.json())
.then((data) => {
    var likes = document.getElementById('likes');
    likes.innerHTML = data.likes;
    console.log("data === ",data);
    views.innerHTML = data.views;
})
like_button.addEventListener('click', () => {
    fetch(`/users/toggle/like_notes/${note_name}`, {method: 'PUT'})
    .then((response) => response.json())
    .then(() => {
        console.log('like done successfully');
        var likes = document.getElementById('likes');
        likes.innerHTML = parseInt(likes.innerHTML) + 1;
    })
    .catch((error) => console.log(error));
});

var add_comment_to_note = document.getElementById('add_comment_to_note');
var add_comment_note_btn = document.getElementById('add_comment_note_btn');
var comments_section = document.getElementById('comments_section');


add_comment_note_btn.addEventListener("click", function() {
    if (add_comment_to_note.value!="") {
        var data = {
            "file": note_name,
            "text": add_comment_to_note.value,
            "type": "Notes",
            "comment": null
        }

        new Noty({

            theme:'relax',
            type:'success',
            text:'Comment Added!!!',
            layout:"topCenter",
            timeout:3000


        }).show();

        fetch(`/users/toggle/new_note_comment`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        add_comment_to_note.value = "";
    }
});

function fetchAllComments() {
    fetch(`/users/toggle/get_all_comments/${note_id.innerHTML}`)
    .then((response) => response.json())
    .then((comments_response) => {
        // console.log(comments_response);
        var keys = Object.keys(comments_response);
        for (var i of keys) {
            var comment_div = document.createElement("div");
            comment_div.setAttribute('id', 'comment_div');
            var parent_comment_p = document.createElement("p");
            parent_comment_p.innerHTML = comments_response[i]["text"];
            var input = document.createElement("input");
            var submit = document.createElement("input");
            submit.setAttribute('id', i);
            input.classList.add(i);
            submit.addEventListener('click', function(e) {
                e.preventDefault();
                var id = e.target.id;
                var comment_text = document.getElementsByClassName(id)[0];
                if (comment_text.value!="") {
                    var data = {
                        "file": note_name,
                        "text": comment_text.value,
                        "type": "Comments",
                        "comment": id
                    }
                    fetch(`/users/toggle/new_note_comment   `, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    comment_text.value = "";
                    new Noty({

                        theme:'relax',
                        type:'success',
                        text:'Child Comment Added!!!',
                        layout:"topCenter",
                        timeout:3000
            
            
                    }).show();
                }
            });
            input.type = "text";
            submit.type = "submit";
            submit.value = "add comment";
            comment_div.appendChild(parent_comment_p);
            comment_div.appendChild(input);
            comment_div.appendChild(submit);
            var child_comment_ids = Object.keys(comments_response[i]['child_comments']);
            for (var j=0; j<child_comment_ids.length; j++) {
                var p = document.createElement('p');
                p.innerHTML = comments_response[i]['child_comments'][child_comment_ids[j]];
             
                comment_div.appendChild(p);
            }
            comments_section.appendChild(comment_div);
        }
    });
}
fetchAllComments();