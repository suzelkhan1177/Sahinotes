API_KEY =
  "iI29zBShf0RrV7gPQdTEH8vnGKjkbZuLtWXsYyUDwaAq64eCcmgLKvU3W9C47NxPkDamJ0MblFV2cE5u";

const fast2sms = require("fast-two-sms");

var options = {
  authorization: API_KEY,
  message: "Your OTP is 6789",
  numbers: ["7830876003"],
};

async function sendOtpMessage() {
    const res = await fast2sms.sendMessage(options);
    if(res){
        console.log(res);
    }else{
        console.log('Balance Over');
    } 
}

sendOtpMessage();

// fast2sms
//   .sendMessage(options)
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
