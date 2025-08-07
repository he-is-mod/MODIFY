// config/cloudinary.config.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "audio_uploads",
    resource_type: "auto", // auto = support for audio, images, etc.
    format: async (req, file) => file.mimetype.split("/")[1], // keep file format
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    resource_type: "image",
    format: async (req, file) => file.mimetype.split("/")[1],
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

module.exports = { cloudinary, audioStorage, imageStorage };
