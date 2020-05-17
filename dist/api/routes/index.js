"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_1 = require("../models/movie");
const movies_1 = require("../controllers/movies");
const pagination_1 = require("../middleware/pagination");
// const express = require("express");
// const Movie = require("../models/movie");
// const MovieController = require("../controllers/movies");
// const pagination = require("../middleware/pagination");
// const { check } = require("express-validator");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const app = express_1.default();
app.use(express_1.default.json());
router.get("/", (req, res) => {
    res.redirect("/movies/");
});
// router.get(
//   "/movies/",
//   Paginating.paginatedResults(Movie),
//   MovieController.get_all
// );
// router.get("/movies", (req, res) => {paginatedResults(Movie), get_all})
//@ts-ignore
router.get("/movies", pagination_1.paginatedResults(movie_1.Movie), movies_1.get_all);
router.get("/movies/:id", movies_1.get_one);
router.get("/movies/:id/images/:type", movies_1.get_images);
router.post("/movies", [
    express_validator_1.check("title")
        .trim()
        .escape(),
    express_validator_1.check("director")
        .trim()
        .escape(),
    express_validator_1.check("shortDescription")
        .trim()
        .escape(),
    express_validator_1.check("duration")
        .isNumeric()
        .trim()
        .escape(),
    express_validator_1.check("releaseDate")
        .isLength({ min: 8 })
        .toDate()
        .trim()
        .escape(),
    express_validator_1.check("images.cover")
        .trim()
        .escape(),
    express_validator_1.check("images.poster")
        .trim()
        .escape(),
    express_validator_1.check("images.background")
        .trim()
        .escape(),
    express_validator_1.check("genre")
        .trim()
        .escape(),
    express_validator_1.check("childrenFriendly").isBoolean()
], movies_1.post_one);
router.patch("/movies/:id", movies_1.update_one);
router.delete("/movies/:id", movies_1.delete_one);
exports.default = router;
