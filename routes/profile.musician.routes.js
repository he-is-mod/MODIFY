const express = require("express");
const musicianRouter = express.Router();
const Musician = require("../models/users.models");
const { ensureAuthenticated } = require("../middleware/auth");

musicianRouter.get("/profile", ensureAuthenticated, async (req, res) => {


  if (!req.user) {
    return res.redirect("/login");
  }
  const musicianId = req.user.id;
  try {
    const user = await Musician.getMusicianById(musicianId);
    if (!user) return res.send("User not found");

    const tracks = (await Musician.getTracksByArtist(user.id)) || [];
    console.log("Tracks loaded:", tracks);
    res.render("musician/profile", {
      musician: user,
      tracks,
      profilePicSuccess: req.query.profilePicSuccess === "1",
      trackSuccess: req.query.trackSuccess === "1",
    });
  } catch (err) {
    console.error(err);
    res.send("An error occurred loading your profile.");
  }

    // res.render("musician/profile", { user: req.user });

});

module.exports = musicianRouter;
