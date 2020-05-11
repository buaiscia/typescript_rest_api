const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, "Title is mandatory"],
        min: [1, "Must be at least 1 character"]
    },
    director: {
        type: String,
        required: [true, "Director is mandatory"],
        min: [2, "Must be at least 2 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is mandatory"],
        min: [20, "Must be at least 20 characters"],
        max: [600, "Must be at max 600 characters"]
    },
    shortDescription: {
        type: String,
        required: false,
        min: [10, "Must be at least 10 characters"],
        max: [150, "Must be at max 600 characters"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is mandatory"],
        min: [10, "Time is too little, min is 10"]
    },
    releaseDate: {
        type: String,
        required: false
    },
    images: {
        cover: {
            type: String,
            required: false
        },
        poster: {
            type: String,
            required: [true, "At least the poster image is mandatory"],
        },
        background: {
            type: String,
            required: false
        }
    },
    genre: {
        type: String,
        enum: ["Documentary", "Scifi", "Thriller", "Biography", "Romance", "Children", "Other"],
        required: true
    },
    childrenFriendly: {
        type: Boolean,
        required: false
    },
});

var Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
