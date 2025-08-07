const multer = require("multer");
const path = require("path");

const createUploader = ({ maxSizeMB }) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.fieldname === "audio") {
          cb(null, path.join(__dirname, "../uploads/audio"));
        } else if (file.fieldname === "cover") {
          cb(null, path.join(__dirname, "../uploads/covers"));
        } else if (file.fieldname === "profilePic") {
          cb(null, path.join(__dirname, "../uploads/profile_pics"));
        } else {
          cb(new Error("Invalid field name"), false);
        }
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
      },
    }),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      const audioExts = [".mp3", ".wav", ".mpeg"];
      const imageExts = [".jpg", ".jpeg", ".png", ".gif"];
      const ext = path.extname(file.originalname).toLowerCase();

      if (
        (file.fieldname === "audio" && audioExts.includes(ext)) ||
        (file.fieldname === "cover" && imageExts.includes(ext)) ||
        (file.fieldname === "profilePic" && imageExts.includes(ext))
      ) {
        cb(null, true);
      } else {
        cb(new Error("File type not allowed"), false);
      }
    },
  });
};

module.exports = createUploader;
