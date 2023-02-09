fetch(`/users/get_all_users`)
  .then((response) => response.json())
  .then((data) => console.log(data));