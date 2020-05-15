import { Request, Response, NextFunction, RequestHandler} from "express-serve-static-core";

interface ReqQuery extends Response {
  query: {
    page: string,
    limit: string,
    search: string,
    genre: string
  }
}

interface ResPagination extends Response {
  paginatedResults: {}
}

const escapeStringRegexp = require("escape-string-regexp");

const paginatedResults = (model: any) => {
  return async (req: ReqQuery, res: ResPagination, next: NextFunction) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results: {
      next?: {},
      previous?: {},
      results?: {},
      countFound?: number
    } = {};
    let totalCount = 0;

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    try {
      // results.results = {};

      if (req.query.search || req.query.genre) {
        if (req.query.search) {
          const search_key = escapeStringRegexp(req.query["search"].toString());
          results.results = await model
            .find({ title: new RegExp(search_key, "i") })
            .select("-__v")
            .limit(limit)
            .skip(startIndex)
            .exec();
        } else {
          const genre_key = escapeStringRegexp(req.query["genre"].toString());
          results.results = await model
            .find({ genre: new RegExp(genre_key, "i") })
            .select("-__v")
            .limit(limit)
            .skip(startIndex)
            .exec();
        }
      } else {
        results.results = await model
          .find()
          .select("-__v")
          .limit(limit)
          .skip(startIndex)
          .exec();
      }

      try {
        if (Object.keys((results.results)!).length === 0) {
          res.status(404).json({ status: 404, message: "Not found" });
        } else {
          // totalCount = await results.results.length;
          totalCount = Object.keys((results.results)!).length;
          results.countFound = totalCount;
          res.paginatedResults = results;
          next();
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export default paginatedResults;
