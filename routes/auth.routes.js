const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { register, logout } = require("../controllers/auth.controllers");
const pool = require("../config/database");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Register routes
authRouter.post("/register", register);
authRouter.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Login routes
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");

    req.logIn(user, (err) => {
      if (err) return next(err);

      if (user.role === "musician") {
        return res.redirect("/musician/profile");
      } else if (user.role === "listener") {
        return res.redirect("/listener/profile");
      } else {
        return res.redirect("/");
      }
    });
  })(req, res, next);
});

authRouter.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// Logout route
authRouter.get("/logout", logout);

// ✅ FORGOT PASSWORD ROUTES

// GET forgot password form
authRouter.get("/forgot-password", (req, res) => {
  res.render("forgot-password.ejs", {
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

// POST request to send reset code email
authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Generate 6-digit numeric code as string
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Update user with reset code and expiry (10 min)
    const [result] = await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = NOW() + INTERVAL 10 MINUTE WHERE email = ?",
      [resetCode, email]
    );

    // Check if email exists in DB
    if (result.affectedRows === 0) {
      req.flash("error_msg", "Email not found.");
      return res.redirect("/forgot-password");
    }

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset code email
    await transporter.sendMail({
      to: email,
      subject: "Your Password Reset Code – Modify",
      html: `<p>Your password reset code is: <b>${resetCode}</b>. It will expire in 10 minutes.</p>`,
    });

    // Store email in session to use later on verify page
    req.session.resetEmail = email;
    req.flash("success_msg", "Reset code sent to your email.");
    res.redirect("/verify-reset-code");
  } catch (err) {
    console.error("Error sending reset code email:", err);
    req.flash("error_msg", "Error sending reset code email. Try again.");
    res.redirect("/forgot-password");
  }
});

// GET verify reset code + new password form
authRouter.get("/verify-reset-code", (req, res) => {
  if (!req.session.resetEmail) {
    req.flash("error_msg", "Please enter your email first.");
    return res.redirect("/forgot-password");
  }

  res.render("verify-reset-code.ejs", {
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

// POST verify reset code + set new password
authRouter.post("/verify-reset-code", async (req, res) => {
  const { code, password } = req.body;
  const email = req.session.resetEmail;

  if (!email) {
    req.flash("error_msg", "Session expired. Please start again.");
    return res.redirect("/forgot-password");
  }

  try {
    // Check if code matches and not expired
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW()",
      [email, code]
    );

    if (rows.length === 0) {
      req.flash("error_msg", "Invalid or expired code.");
      return res.redirect("/verify-reset-code");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password & clear reset token
    await pool.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    // Clear session email
    delete req.session.resetEmail;

    req.flash(
      "success_msg",
      "Password updated successfully. You can now log in."
    );
    res.redirect("/login");
  } catch (err) {
    console.error("Error resetting password:", err);
    req.flash("error_msg", "Something went wrong. Try again.");
    res.redirect("/verify-reset-code");
  }
});

module.exports = authRouter;
