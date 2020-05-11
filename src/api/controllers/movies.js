const mongoose = require("mongoose");
const Movie = require("../models/movie");

//REDIS SETUP

const redis = require("redis");

// const host = process.env.redis_server_addr || "localhost"; // in use with docker
let redisClient = '';

if(process.env.REDIS_URL) {
  redisClient = redis.createClient(process.env.REDIS_URL)
}
else {
  const host = process.env.redis_server_addr || "localhost"; // TO USE WITH DOCKER // NEED TO HAVE A REDIS SERVER RUNNING ON THE MACHINE
  redisClient = redis.createClient({ 
    host: host,
    port: 6379 
  });
}




redisClient.on("ready", function () {
  console.log("Redis is ready");
});

redisClient.on("error", function (err) {
  console.log("Error in Redis:" + err);
});

redisClient.expire("redisClient", 3600);


// METHODS

exports.get_all = (req, res) => {
  redisClient.get("/movies", function (err) {
    if (err) {
      res.status(500).json(err.message);
    }
    res.json(res.paginatedResults);
  });
};

exports.get_one = (req, res) => {
  const id = req.params.id;
  Movie.findById(id)
    .select("-__v")
    .then(result => {
      if (result) {
        res.status(200).json({
          item: result,
          request: {
            type: "GET",
            url: req.get("host") + "/movies/" + result._id
          }
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "The provided ID does not match any movie"
        });
      }
    })
    .catch(err => {
      res.status(400).json({
        status: 400,
        readMessage: "Invalid ID provided",
        error: err.message
      });
    });
};

exports.get_images = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  Movie.findById(id)
    .then(result => {
      if (type === "poster" || type === "cover" || type === "background") {
        const imgType = result.images[type];
        res.status(200).json({ posterImage: imgType });
      } else {
        res.status(404).json({
          status: 404,
          readMessage: "type of image not found"
        });
      }
    })
    .catch(err => {
      res.status(400).json({
        status: 400,
        readMessage: "Invalid ID provided",
        error: err.message
      });
    });
};

exports.post_one = (req, res) => {
  const movie = new Movie({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    director: req.body.director,
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    duration: req.body.duration,
    releaseDate: req.body.releaseDate,
    images: req.body.images,
    genre: req.body.genre,
    childrenFriendly: req.body.childrenFriendly
  });

  movie
    .save()
    .then(result => {
      res.status(200).json({
        item: result,
        request: {
          type: "GET",
          url: req.get("host") + "/movies/" + result._id
        }
      });
    })
    .catch(err => {
      res.status(405).json({
        status: 405,
        message: err.message
      });
    });
};

exports.update_one = (req, res) => {
  const id = req.params.id;
  const validator = { runValidators: true };

  Movie.findById(id)
    .then(movieObj => {
      Movie.updateOne({ _id: id }, req.body, validator)
        .then(result => {
          res.status(200).json({
            message: "Item updated",
            item: result,
            request: {
              type: "GET",
              url: req.get("host") + "/movies/" + movieObj._id
            }
          });
        })
        .catch(err => {
          res.status(405).json({
            status: 405,
            readMessage: "Error in input validation",
            message: err.message
          });
        });
    })
    .catch(err => {
      res.status(404).json({
        status: 404,
        readMessage: "Movie to update not found",
        message: err.message
      });
    });
};

exports.delete_one = (req, res) => {
  const id = req.params.id;
  Movie.findById(id)
    .then(movieObj => {
      if (movieObj) {
        Movie.deleteOne({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
              message: "Item deleted",
              item: result
            });
          })
          .catch(err => {
            res.status(400).json({
              status: 400,
              message: err.message
            });
          });
      } else {
        res.status(400).json({
          status: 400,
          message: "Invalid ID provided"
        });
      }
    })
    .catch(err => {
      res.status(404).json({
        status: 404,
        readMessage: "Movie to delete not found",
        message: err.message
      });
    });
};
