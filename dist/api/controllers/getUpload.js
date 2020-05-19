"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
const fs_1 = __importDefault(require("fs"));
const movie_1 = require("../models/movie");
exports.postFile = (req, res) => {
    // const formidable = require("formidable");
    // const fs = require("fs");
    // const mongoose = require("mongoose");
    // const Movie = require("../models/movie");
    // FORMIDABLE
    const form = new formidable_1.IncomingForm();
    form.uploadDir = "dist/collection/";
    form.parse(req, err => {
        if (err) {
            // next(err);
            return;
        }
    });
    form.on("fileBegin", function (name, file) {
        file.path = "dist/collection/" + file.name;
    });
    form.on("file", function (name, file) {
        file.path = "dist/collection/" + file.name;
        let pathFile = file.path;
        let fileToRead = fs_1.default.readFileSync(pathFile, "utf-8");
        let parsed = JSON.parse(fileToRead);
        movie_1.Movie.insertMany(parsed, function (err) {
            if (err) {
                res.status(400).json({
                    message: "Bad request",
                    error: err.message
                });
            }
            else {
                res.status(200).json({
                    message: "Collection uploaded"
                });
            }
        });
    });
};
//# sourceMappingURL=getUpload.js.map