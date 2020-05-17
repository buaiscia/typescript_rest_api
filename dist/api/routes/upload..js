"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// const express = require("express");
const router = express_1.default.Router();
// const path = require("path");
const getUpload_1 = require("../controllers/getUpload");
// const getUpload = require("../controllers/getUpload");
router.get("/", (req, res) => {
    res.sendFile("upload.html", {
        root: path_1.default.join(__dirname, "../views/")
    });
});
router.post("/", getUpload_1.post);
exports.default = router;
