import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import logger from "morgan";


const app = express();


import swaggerUi from "swagger-ui-express";
import openApiDocumentation from "./openapi.json";

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// INTERFACES

interface Error {
    status?: number;
    message?: string;
}

// CONFIGURATION

app.use(express.static(__dirname + "/view"));
app.use(express.static(__dirname + "/api/public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

//  MONGODB SETUP

let url: string = '';

if(process.env.DATABASEURL) {
    url = process.env.DATABASEURL;
    mongoose.connect(url, {
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
    const dbName: string = "moviesDB";
    mongoose
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

app.use((req: Request, res: Response, next: NextFunction) => {
    const allowed: string = "*";
    res.header("Access-Control-Allow-Origin", allowed);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
        return res.status(200).json({});
    }
    next();
});


// SET ROUTES

//@ts-ignore
import indexRoute from "./api/routes/index"; 
//@ts-ignore
import uploadRoute from "./api/routes/upload";  

// USE ROUTES

app.use("/upload", uploadRoute);
app.use("/", indexRoute);

//ERROR/404 ROUTES

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    err = new Error("Page not found");
    err.status = 404;
    next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        error: { message: err.message }
    });
});

// SERVER

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
