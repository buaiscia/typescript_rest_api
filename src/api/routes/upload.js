const express = require("express");
const router = express.Router();
const path = require("path");

const getUpload = require("../controllers/getUpload");

router.get("/", (req, res) => {
    res.sendFile("upload.html", {
        root: path.join(__dirname, "../views/")
    });
});

router.post("/", getUpload.post);

module.exports = router;
