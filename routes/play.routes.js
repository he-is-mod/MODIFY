const express = require("express");
const playRouter = express.Router();
const pool = require("../config/database");
const { ensureAuthenticated } = require("../middleware/auth");

// POST /play/:id — set current track in session
playRouter.post("/play/:id", ensureAuthenticated, async (req, res) => {
  const trackId = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM tracks WHERE id = ?", [
      trackId,
    ]);
    const track = rows[0];

    if (!track) return res.status(404).send("Track not found");

    // Save track to session
    req.session.currentTrack = {
      id: track.id,
      title: track.title,
      url: track.url,
    };

    res.redirect("/nowPlaying");
  } catch (error) {
    console.error("Play error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = playRouter;
