"use strict";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary.config");
const storageClient = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormat: ["jpg", "png", "jpeg"],
  params: {
    folder: (req, file) => `avatar/client/${req.params.id}`,
    format: async (req, file) => {
      return "jpg";
    },
  },
});
const uploadClient = multer({
  storage: storageClient,
});

module.exports = { uploadClient };
