import { client } from "@gradio/client";
import fs from 'fs';

async function test() {
  try {
    console.log("Connecting to Gradio space...");
    const app = await client("yisol/IDM-VTON");
    
    console.log("Fetching test images...");
    const humanUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    const garmentUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

    const humanRes = await fetch(humanUrl);
    const humanBlob = await humanRes.blob();
    
    const garmentRes = await fetch(garmentUrl);
    const garmentBlob = await garmentRes.blob();

    console.log("Making prediction...");
    
    // Gradio v4 ImageEditor inputs usually require an object
    const result = await app.predict("/tryon", [
        { "background": humanBlob, "layers": [], "composite": null }, // dict
        garmentBlob, // garm_img
        "A fashion garment", // garment_des
        true, // is_checked
        false, // is_checked_crop
        30, // denoise_steps
        42, // seed
    ]);

    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
