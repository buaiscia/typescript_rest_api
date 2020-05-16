import  { Request, Response, NextFunction } from "express";
import formidable  from "formidable";
import fs from "fs";
import * as mongoose from "mongoose";
import { Movie } from "../models/movie";



interface files {
  name?: string;
  path?: string;

}


  export const post = (req: Request, res: Response) => {
  
  
    // const formidable = require("formidable");
    // const fs = require("fs");
    // const mongoose = require("mongoose");
    // const Movie = require("../models/movie");
  
    // FORMIDABLE
  
    //@ts-ignore
    const form = new formidable.IncomingForm({ multiples: true });
    form.uploadDir = "collection/";
  
    form.parse((req: Request, err: Error, next: NextFunction) => {
      if (err) {
        next(err);
        return;
      }
    });
  
    form.on("fileBegin", function (file: files) {
      file.path = "collection/" + file.name;
    });
  
    form.on("file", function (file: files) {
      file.path = "collection/" + file.name;
      let pathFile = file.path;
      let fileToRead = fs.readFileSync(pathFile, "utf-8");
      let parsed = JSON.parse(fileToRead);
  
      Movie.insertMany(parsed, function (err: Error) {
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
