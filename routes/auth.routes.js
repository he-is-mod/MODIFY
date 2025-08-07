const express = require("express");
const passport = require("passport");
const { register, logout } = require("../controllers/auth.controllers");
const authRouter = express.Router();

// Register route
authRouter.post("/register", register);

authRouter.get("/register", (req, res) => {
  res.render("register.ejs")
});


authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login"); // authentication failed

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Redirect based on role
      if (user.role === "musician") {
        return res.redirect("/musician/profile");
      } else if (user.role === "listener") {
        return res.redirect("/listener/profile");
      } else {
        return res.redirect("/"); // default or error page
      }
    });
  })(req, res, next);
});


authRouter.get("/login", (req, res) => {
  res.render("login.ejs");
});


// Logout route
authRouter.get("/logout", logout);

module.exports = authRouter;
