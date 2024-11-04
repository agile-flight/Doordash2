/*
This file configures and starts the Express server to handle HTTP requests.

- Imports necessary libraries and modules.
- Sets up middleware for security, logging, CORS, and request parsing.
- Connects to the MongoDB database.
- Defines API routes.
- Starts the server and listens on the specified port.
*/

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//The require functions in the lines below include their module.exports
const connectDB = require("./db");                 
const doordash = require("./routes/api/doordash");

const PORT = 4000;
const app = express();

//Cors setup by passing the following JSON
app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true
    })
)

//BodyParser setup  
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Morgan and Helmet setup
app.use(morgan("dev"));
app.use(helmet());

//Connect to DB and route for the doordash API calls 
connectDB();
    //app.use("/v1/doordash", doordash)
app.listen(PORT, console.log(`API is listening on port ${PORT}`));

