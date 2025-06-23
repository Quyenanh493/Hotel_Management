import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import initWebRoutes from "./routes/web.js"
import initApiRoutes from "./routes/api.js"
import connectDB from "./config/connectDB.js"
import errorMiddleware from "./middleware/errorMiddleware";
import configCors from "./config/cors.js";
require("dotenv").config();

let app = express();

// CORS middleware
app.use(cors(configCors));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

// Routes
initWebRoutes(app);
initApiRoutes(app);

// Error handling middleware
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

// Database connection
connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})