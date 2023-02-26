const express = require("express");
const app = express();
const port = 8000;
const expressEjsLayout = require("express-ejs-layouts");
require("./config/mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport-local-strategy");
const session = require("express-session");
//ES helps in creating sessions and stores them in cookies
// cookie-parser helps in storing those cookies in the rrequest and getting it back from response

const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const flashMidilware = require("./config/middleware");
require("./config/passport-google-strategy");
require("./config/nodemailer");
const sassMiddleware = require("node-sass-middleware");
// require('./config/mobile_auth');

const bodyParser = require("body-parser");
const env = require("./environment");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const fs = require("fs");
const { SECRET_PASS } = require("./environment");

const logDirectory = __dirname + "/logs";
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logStream = rfs.createStream("access.log", {
  interval: "1h",
  path: logDirectory
});

const expressFileUpload = require('express-fileupload');

app.use(expressFileUpload({}));

app.use(morgan("dev", { stream: logStream }));

app.use(bodyParser());
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    outputSytle: "extended",
    prefix: "/css",
  })
);

app.use(expressEjsLayout);

app.set("view engine", "ejs");
app.set("views", "./views");

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.urlencoded()); // help in making  POST Api calls
app.use(cookieParser()); // help in putting cookeis to req and taking from

app.use(express.static("./assets"));

//router and folder location
app.use("/uploads/notes", express.static("/uploads/notes"));

app.use(
  session({
    name: env.SECRET_NAME,
    secret: env.SECRET_PASS,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },
    store: mongoStore.create({ mongoUrl: env.MONGO_URL }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(flashMidilware.flash);

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in Server Runing", err);
    return;
  }

  console.log("server Runing 8000", port);
});
