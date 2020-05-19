import express, { Request, Response } from "express";
import { Movie } from "../models/movie";
import { get_all, get_one, get_images, post_one, update_one, delete_one } from "../controllers/movies";
import { paginatedResults } from "../middleware/pagination";

// const express = require("express");
// const Movie = require("../models/movie");
// const MovieController = require("../controllers/movies");
// const pagination = require("../middleware/pagination");
// const { check } = require("express-validator");

import { check } from "express-validator";

const router = express.Router();

const app = express();

app.use(express.json());

router.get("/", (req, res) => {
  res.redirect("/movies/");
});


router.get("/movies", [paginatedResults(Movie)] ,get_all)

router.get("/movies/:id", get_one);

router.get("/movies/:id/images/:type", get_images);

router.post(
  "/movies",
  [
    check("title")
      .trim()
      .escape(),
    check("director")
      .trim()
      .escape(),
    check("shortDescription")
      .trim()
      .escape(),
    check("duration")
      .isNumeric()
      .trim()
      .escape(),
    check("releaseDate")
      .isLength({ min: 8 })
      .toDate()
      .trim()
      .escape(),
    check("images.cover")
      .trim()
      .escape(),
    check("images.poster")
      .trim()
      .escape(),
    check("images.background")
      .trim()
      .escape(),
    check("genre")
      .trim()
      .escape(),
    check("childrenFriendly").isBoolean()
  ],
  post_one);

router.patch("/movies/:id", update_one);

router.delete("/movies/:id", delete_one);

export default router;