var sendOtpButton = document.getElementById("sendOtpButton");
var mobileNumber = document.getElementById("mobileNumber");

sendOtpButton.addEventListener("click", function (e) {

      //call a GET API
      e.preventDefault();
      console.log(mobileNumber.value);
      fetch(`/users/send_otp_message/${mobileNumber.value}`);
      console.log('otp sent');
});

var verify = document.getElementById('verify');
var otp = document.getElementById('otp');
verify.addEventListener('click', function(e) {
     e.preventDefault();
     var obj = {};
     obj.otp = otp.value;
     obj.mobileNumber = mobileNumber.value;

    //   convert object to text so that you can send it in a url
    fetch(`/users/verify_otp/${JSON.stringify(obj)}`);
});
