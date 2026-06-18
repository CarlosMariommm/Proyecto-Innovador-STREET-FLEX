//Import the ORM Mongoose. It provides a higher-level abstraction for interacting with the database, allowing us to define schemas, models, and perform CRUD operations more easily.

import mongoose from "mongoose";
import { config } from "./config.js";

//Connect to the database using the URI specified in the config object, which is loaded from the environment variables. This establishes a connection to the MongoDB database, allowing us to perform operations on it using Mongoose.
mongoose.connect(config.db.URI)

//Create a constant that is equal to the Mongoose connection, which allows us to handle events related to the database connection, such as errors or successful connection confirmations.
const connection = mongoose.connection;

//If the database connects successfully, the "open" event is triggered and a message is displayed in the console indicating that the database connection was successful. If an error occurs during the connection, it is caught and a message is displayed in the console with the details of the error.
connection.once("open", () => {
    console.log("DB is connected");
})

//If the database disconnects, the "disconnected" event is triggered and a message is displayed in the console indicating that the connection to the database has been lost.
connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

//If an error occurs during the connection, it is caught and a message is displayed in the console with the details of the error.
connection.on("error", (err) => {
    console.log("Error connecting to the database:", err);
});

