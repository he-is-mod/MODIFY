const bcrypt = require("bcrypt");
const promisePool = require("../config/database");
const { sendTokens } = require("../services/sendToken");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Registering user:", { name, email, role });

    // Check if email already exists
    const [existingUsers] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Email already registered:", email);
      return res.redirect("/register");
    }

    // If email is new, insert user
    await promisePool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    console.log("User registered successfully");

    await sendTokens({ token: 23452345, email });

    return res.redirect("/login");
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.redirect("/register");
  }
};

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return next(err); // pass to Express error handler
    }
    req.flash("success_msg", "You have successfully logged out.");
    res.redirect("/login");
  });
};


module.exports = { register, logout };
