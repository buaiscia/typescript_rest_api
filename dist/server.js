"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_json_1 = __importDefault(require("./openapi.json"));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_json_1.default));
// CONFIGURATION
app.use(express_1.default.static(__dirname + "/view"));
app.use(express_1.default.static(__dirname + "/api/public"));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default("dev"));
//  MONGODB SETUP
let url = '';
if (process.env.DATABASEURL) {
    url = process.env.DATABASEURL;
    mongoose_1.default.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
        console.log("Database connection successful");
    })
        .catch(err => {
        console.error("Database connection error: " + err);
    });
}
else {
    //url = "mongodb://mongo:27017";  // TO USE WITH DOCKER
    url = "mongodb://localhost:27017"; // TO USE LOCALLY
    const dbName = "moviesDB";
    mongoose_1.default
        .connect(`${url}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
        console.log("Database connection successful");
    })
        .catch(err => {
        console.error("Database connection error: " + err);
    });
}
//SETUP HEADERS
app.use((req, res, next) => {
    const allowed = "*";
    res.header("Access-Control-Allow-Origin", allowed);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
        return res.status(200).json({});
    }
    next();
});
// SET ROUTES
//@ts-ignore
const index_1 = __importDefault(require("./api/routes/index"));
//@ts-ignore
const upload_1 = __importDefault(require("./api/routes/upload"));
// USE ROUTES
app.use("/upload", upload_1.default);
app.use("/", index_1.default);
//ERROR/404 ROUTES
app.use((err, req, res, next) => {
    err = new Error("Page not found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: { message: err.message }
    });
});
// SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
