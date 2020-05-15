// const mongoose = require("mongoose");
// const Movie = require("../models/movie");
import  { Request, Response } from "express";


import * as mongoose from "mongoose";
import { Movie } from "../models/movie";

interface PaginatedResponse extends Response{
  paginatedResults?: {}
}

//REDIS SETUP

// const redis = require("redis");

import * as redis from "redis";

// const host = process.env.redis_server_addr || "localhost"; // in use with docker
let redisClient: any;

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

redisClient.on("error", function (err: Error) {
  console.log("Error in Redis:" + err);
});

redisClient.expire("redisClient", 3600);


// METHODS

class Controllers {

  get_all = (req: Request, res: PaginatedResponse) => {
    redisClient.get("/movies", function (err: Error) {
      if (err) {
        res.status(500).json(err.message);
      }
      res.json(res.paginatedResults);
    });
  };
  
  get_one = (req: Request, res: Response) => {
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
  
  get_images = (req: Request, res: Response) => {
    const id = req.params.id;
    const type = req.params.type;
    Movie.findById(id)
      .then(result => {
        if (type === "poster" || type === "cover" || type === "background") {
          const imgType = result!.images[type];
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
  
  post_one = (req: Request, res: Response) => {
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
  
  update_one = (req: Request, res: Response) => {
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
                url: req.get("host") + "/movies/" + movieObj!._id
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
  
  delete_one = (req: Request, res: Response) => {
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
}

export default Controllers;

