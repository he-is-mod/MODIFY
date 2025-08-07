const express = require("express");
const uploadProfilePicRouter = express.Router();
const createUploader = require("../config/multerConfig");
const { ensureAuthenticated } = require("../middleware/auth");
const pool = require("../config/database");



// Custom uploader for profile pics
const uploadProfilePic = createUploader({
  destFolder: "uploads/profile_pics",
  maxSizeMB: 5,
  allowedFileTypes: ["jpg", "jpeg", "png", "gif", "webp"],
});

uploadProfilePicRouter.post(
  "/profilePic",
  ensureAuthenticated,
  uploadProfilePic.single("profilePic"),
  async (req, res) => {
    try {
     const filePath = `/uploads/profile_pics/${req.file.filename}`;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Save file path to DB
      await pool.query("UPDATE users SET profile_picture = ? WHERE id = ?", [
        filePath,
        userId,
      ]);

      // Redirect based on role
      req.flash("success", "Profile picture updated successfully!");
      if (userRole === "musician") {
        res.redirect("/musician/profile");
      } else if (userRole === "listener") {
        res.redirect("/listener/profile");
      } else {
        res.redirect("/"); // fallback if role unknown
      }
    } catch (err) {
      console.error("Profile picture upload error:", err);
      res
        .status(500)
        .send("Something went wrong uploading your profile picture.");
    }
    }
);

module.exports = uploadProfilePicRouter;
