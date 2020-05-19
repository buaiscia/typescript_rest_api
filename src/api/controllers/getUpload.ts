import { Request, Response, NextFunction } from "express";
import { IncomingForm } from "formidable";
import fs from "fs";
import * as mongoose from "mongoose";
import { Movie } from "../models/movie";



interface files {
  name?: string;
  path?: any;

}


export const postFile = (req: Request, res: Response) => {


  // const formidable = require("formidable");
  // const fs = require("fs");
  // const mongoose = require("mongoose");
  // const Movie = require("../models/movie");

  // FORMIDABLE

  const form = new IncomingForm();

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
    let fileToRead = fs.readFileSync(pathFile, "utf-8");
    let parsed = JSON.parse(fileToRead);

    Movie.insertMany(parsed, function (err) {
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
