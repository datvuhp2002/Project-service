"use strict";
const express = require("express");
const ClientController = require("../../controllers/client.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { uploadClient } = require("../../middleware");
const router = express.Router();

// create
router.post("/create", asyncHandler(ClientController.create));
// getAll
router.get("/getAll", asyncHandler(ClientController.getAll));
router.get("/trash", asyncHandler(ClientController.trash));
// find by Id
router.post("/detail/:id", asyncHandler(ClientController.detail));
// update
router.put("/update/:id", asyncHandler(ClientController.update));
router.post(
  "/uploadAvatarFromLocal/:id",
  uploadClient.single("file"),
  asyncHandler(ClientController.uploadFileAvatarFromLocal)
);
router.post("/getAvatar", asyncHandler(ClientController.getAvatar));
router.delete("/delete/:id", asyncHandler(ClientController.delete));
router.put("/restore/:id", asyncHandler(ClientController.restore));
module.exports = router;
