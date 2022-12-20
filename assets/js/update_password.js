var accessToekenInput  = document.getElementById('accessTokenInput');
var url = window.location.href;
console.log(url);
var accessToken = url.substring(url.indexOf('=')+1, url.length);

console.log(accessToken);
accessToekenInput.value = accessToken;
accessToekenInput.style.display = 'none';


