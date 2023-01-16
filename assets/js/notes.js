var like_button = document.getElementById('like_button');
var note_name = document.getElementById('note_name').innerHTML;
fetch(`/users/get_number_of_likes/${note_name}`)
.then((response) => response.json())
.then((n) => {
    var likes = document.getElementById('likes');
    likes.innerHTML = n;
    console.log("n === ",n);
})
like_button.addEventListener('click', () => {
    fetch(`/users/like_notes/${note_name}`, {method: 'PUT'})
    .then((response) => response.json())
    .then(() => {
        console.log('like done successfully');
        var likes = document.getElementById('likes');
        likes.innerHTML = parseInt(likes.innerHTML) + 1;
    })
    .catch((error) => console.log(error));
});