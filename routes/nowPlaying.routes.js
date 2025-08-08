const express = require("express");
const nowPlaying = express.Router();
const pool = require("../config/database");
const { ensureAuthenticated } = require("../middleware/auth");

// GET current track page
nowPlaying.get("/nowPlaying", ensureAuthenticated, async (req, res) => {
  const trackId =
    req.query.trackId ||
    (req.session.currentTrack && req.session.currentTrack.id);

  if (!trackId) {
    return res.render("nowPlaying", { track: null, user: req.user });
  }

  

  try {
    const [rows] = await pool.query(
      `SELECT tracks.*, users.name AS artist_name 
       FROM tracks 
       LEFT JOIN users ON tracks.musician_id = users.id 
       WHERE tracks.id = ?`,
      [trackId]
    );

    const track = rows[0] || null;
    res.render("nowPlaying", { track, user: req.user });
  } catch (error) {
    console.error("Now Playing error:", error);
    res.status(500).send("Server error");
  }
});

// POST set current track
nowPlaying.post("/setCurrentTrack", ensureAuthenticated, (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Track ID is required" });

  if (!req.session.trackHistory) req.session.trackHistory = [];
  if (req.session.currentTrack?.id) {
    req.session.trackHistory.push(req.session.currentTrack.id);
  }

  req.session.currentTrack = { id };
  res.redirect("/nowPlaying/nowPlaying"); // redirect to the main nowPlaying page
});

// GET next random track at /nowPlaying/nowPlaying/next
nowPlaying.get("/nowPlaying/next", ensureAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id FROM tracks ORDER BY RAND() LIMIT 1"
    );

    if (rows.length > 0) {
      req.session.currentTrack = { id: rows[0].id };
    }

    res.redirect("/nowPlaying/nowPlaying");
  } catch (err) {
    console.error("Next track error:", err);
    res.redirect("/nowPlaying/nowPlaying");
  }
});

// GET previous track at /nowPlaying/nowPlaying/prev
nowPlaying.get("/nowPlaying/prev", ensureAuthenticated, (req, res) => {
  if (req.session.trackHistory && req.session.trackHistory.length > 0) {
    const lastId = req.session.trackHistory.pop();
    req.session.currentTrack = { id: lastId };
  }
  res.redirect("/nowPlaying/nowPlaying");
});



module.exports = nowPlaying;
