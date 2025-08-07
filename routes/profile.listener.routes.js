const express = require("express");
const listenerRouter = express.Router();
const Musician = require("../models/users.models");
const { ensureAuthenticated } = require("../middleware/auth");
const pool = require("../config/database");

listenerRouter.get("/profile", ensureAuthenticated, async (req, res) => {
  if (!req.user) return res.redirect("/login");

  try {
    const user = await Musician.getUserById(req.user.id);
    if (!user) return res.send("User not found");

    // Fetch random tracks (placeholder for 'recently played')
    const [recentTracks] = await pool.query(
      "SELECT * FROM tracks ORDER BY RAND() LIMIT 6"
    );

    res.render("profile.listener.ejs", {
      user: user,
      recentTracks,
    });
  } catch (err) {
    console.error(err);
    res.send("An error occurred loading your listener profile.");
  }
});

module.exports = listenerRouter;
