//Config is a intermediate file that serves as a central place to manage and export configuration settings for the application. It uses the dotenv library to load environment variables from a .env file, which allows us to keep sensitive information like database credentials, API keys, and other configuration details separate from the source code.
import dotenv from 'dotenv';

//Execute the config function from dotenv to load the environment variables from the .env file into process.env. This makes the variables accessible throughout the application using process.env.
dotenv.config();

//Export the config constant by name so that it can be imported in other files using destructuring, as is done in database.js with the line: import { config } from "../config.js";
export const config = {
    db:{
        URI: process.env.DB_URI
    },
    JWT: {
        secret: process.env.JWT_secret_key
    },
    email:{
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    },
    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    }
}