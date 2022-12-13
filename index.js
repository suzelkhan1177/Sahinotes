const express = require("express");
const app = express();
const port = 8000;
const expressEjsLayout = require("express-ejs-layouts");
require("./config/mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
 require("./config/passport-local-strategy");
 const session = require('express-session');
 //ES helps in creating sessions and stores them in cookies 
// cookie-parser helps in storing those cookies in the rrequest and getting it back from response

const mongoStore = require('connect-mongo');
require("./config/passport-google-strategy");
require('./config/nodemailer');
// require('./config/mobile_auth'); 


app.use(expressEjsLayout);

app.set("view engine", "ejs");
app.set("views", "./views");

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.urlencoded()); // help in making  POST Api calls
app.use(cookieParser());// help in putting cookeis to req and taking from 

app.use(express.static("./assets"));

app.use(session({
  name: 'sahinotes',
  secret: 'suzelkhan',
  cookie: {
    maxAge: (60*60*24*1000)
  },
  store: mongoStore.create({mongoUrl: 'mongodb://localhost/sahinotes_development'})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in Server Runing", err);
    return;
  }

  console.log("server Runing 8000", port);
});

  