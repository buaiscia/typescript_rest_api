import  { Request, Response, NextFunction } from "express";

interface error {
  message?: string;
}

exports.post = function (req: Request, res: Response) {
  const formidable = require("formidable");
  const fs = require("fs");
  const mongoose = require("mongoose");
  const Movie = require("../models/movie");

  // FORMIDABLE

  const form = new formidable.IncomingForm({ multiples: true });
  form.uploadDir = "collection/";

  form.parse((req: Request, err: error, next: NextFunction) => {
    if (err) {
      next(err);
      return;
    }
  });

  form.on("fileBegin", function (file: {name: string, path: string}) {
    file.path = "collection/" + file.name;
  });

  form.on("file", function (file: {name: string, path: string}) {
    file.path = "collection/" + file.name;
    let pathFile = file.path;
    let fileToRead = fs.readFileSync(pathFile, "utf-8");
    let parsed = JSON.parse(fileToRead);

    Movie.insertMany(parsed, function (err: error) {
      if (err) {
        res.status(400).json({
          message: "Bad request",
          error: err.message
        });
      } else {
        res.status(200).json({
          message: "Collection uploaded"
        });
      }
    });
  });
};
