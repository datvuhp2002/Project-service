"use strict";
const express = require("express");
const ProjectController = require("../../controllers/project.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

// Lấy ra hết tất cả user
router.get("/getAll", asyncHandler(ProjectController.getAll));

// Lấy ra hết tất cả user đã bị xoá
router.get("/trash", asyncHandler(ProjectController.trash));

// Tạo ra một người dùng mới
router.post("/create", asyncHandler(ProjectController.create));

// Cập nhật một người dùng theo id
router.put("/update/:id", asyncHandler(ProjectController.update));

// Lấy ra chi tiết người dùng theo id
router.get("/detail/:id", asyncHandler(ProjectController.detail));

// Xoá một người dùng theo id
router.delete("/delete/:id", asyncHandler(ProjectController.delete));

// Khôi phục một người dùng đã bị xoá
router.put("/restore/:id", asyncHandler(ProjectController.restore));

module.exports = router;
