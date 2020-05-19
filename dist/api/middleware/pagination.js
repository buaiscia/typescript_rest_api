"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
exports.paginatedResults = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        let totalCount = 0;
        if (endIndex < (yield model.countDocuments().exec())) {
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
                    const search_key = escape_string_regexp_1.default(req.query["search"].toString());
                    results.results = yield model
                        .find({ title: new RegExp(search_key, "i") })
                        .select("-__v")
                        .limit(limit)
                        .skip(startIndex)
                        .exec();
                }
                else {
                    const genre_key = escape_string_regexp_1.default(req.query["genre"].toString());
                    results.results = yield model
                        .find({ genre: new RegExp(genre_key, "i") })
                        .select("-__v")
                        .limit(limit)
                        .skip(startIndex)
                        .exec();
                }
            }
            else {
                results.results = yield model
                    .find()
                    .select("-__v")
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            }
            try {
                if (Object.keys((results.results)).length === 0) {
                    res.status(404).json({ status: 404, message: "Not found" });
                }
                else {
                    // totalCount = await results.results.length;
                    totalCount = Object.keys((results.results)).length;
                    results.countFound = totalCount;
                    res.paginatedResults = results;
                    next();
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};
//# sourceMappingURL=pagination.js.map