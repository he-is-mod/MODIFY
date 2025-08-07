const express = require("express");
const multer = require("multer");
const { ensureAuthenticated, authorizeRoles } = require("../middleware/auth");
const uploadRouter = express.Router();
const { audioStorage } = require("../config/cloudinary.config");
const { createTrack } = require("../models/track.models");
const createUploader = require("../config/multerConfig");

const upload = createUploader({
  destFolder: "uploads/audio/", // save files in uploads/audio/
  maxSizeMB: 20,
  allowedFileTypes: ["mp3", "wav", "mpeg"],
});

// ✅ Route protected by login & musician role
uploadRouter.post(
  "/song",
  ensureAuthenticated,
  authorizeRoles("musician"),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files || !req.files.audio) {
      return res.status(400).send("Audio file is required");
    }

    const { title } = req.body;
    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    const audioUrl = `/uploads/audio/${audioFile.filename}`;
    const coverUrl = coverFile ? `/uploads/covers/${coverFile.filename}` : null;

    const musicianId = req.user.id;

    try {
      await createTrack(title, audioUrl, musicianId, coverUrl);
  res.redirect("/musician/profile?trackSuccess=1");
    } catch (error) {
      console.error("❌ Database error:", error);
      return res.status(500).send("Track upload failed");
    }
  }
);



uploadRouter.get("/", (req, res) => {
  res.render("upload");
});

module.exports = uploadRouter;
