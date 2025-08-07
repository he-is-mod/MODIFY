const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
dotenv.config();
require("./config/passport")(passport);
const cors = require("cors");
const uploadRouter = require("./routes/upload.routes");
const testRoutes = require("./routes/test.routes");
const homeRoutes = require("./routes/home.routes");
const musicianRouter = require("./routes/profile.musician.routes");
const listenerRouter = require("./routes/profile.listener.routes");
const authRouter = require("./routes/auth.routes");
const nowPlaying = require("./routes/nowPlaying.routes");
const playRouter = require("./routes/play.routes");
const SearchRouter = require("./routes/search.routes");
const uploadProfilePicRouter = require("./routes/uploadProfilePic.routes");
const { initEmailTransporter } = require("./config/nodemailer");
const PORT = process.env.PORT;
const fs = require("fs");

// Ensure the uploads/audio directory exists
const audioDir = path.join(__dirname, "uploads/audio");

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5000", // <-- your frontend URL here
    credentials: true, // <-- allow sending cookies with requests
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, // ✅ correct var name
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false,
    },
  })
);


// Call this once when app starts
initEmailTransporter();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

//Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ====== Routes ======
app.get("/", (req, res) => {
  res.render("layout"); // your EJS or template file for landing page
});
app.use("/upload", uploadRouter);
app.use("/test", testRoutes);
app.use("/", homeRoutes);
app.use("/musician", musicianRouter);
app.use("/", authRouter);
app.use("/nowPlaying", nowPlaying);
app.use("/play", playRouter);
app.use("/uploadProfilePic", uploadProfilePicRouter);
app.use("/search", SearchRouter);
app.use("/listener", listenerRouter);

app.get("/debug-session", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});


app.get("/layout", (req, res) => {
  res.render("layout"); // make sure landing.ejs is inside views/
});


// Set flash messages to res.locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// ====== Server ======
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
