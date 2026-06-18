import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { config } from "../../config.js";

// #1 Configure Cloudinary with credentials from config
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
});

// #2 Configurar el almacenamiento de Multer en Cloudinary (resource_type auto)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Elaris de Elite", // Folder in Cloudinary to store uploaded files
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    },
});

// #3 Exportar el parser configurado para interceptar subidas
const parser = multer({ storage });

export default parser;

