
import express, { Request, Response } from "express";

import path from "path";
// const express = require("express");
const router = express.Router();
// const path = require("path");

import  { postFile }  from "../controllers/getUpload";


// const getUpload = require("../controllers/getUpload");

router.get("/", (req, res) => {
    res.sendFile("upload.html", {
        root: path.join(__dirname, "../views/")
    });
});

router.post("/", postFile);

export default router;