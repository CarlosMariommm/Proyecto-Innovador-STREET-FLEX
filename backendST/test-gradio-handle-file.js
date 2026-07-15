import { client, handle_file } from "@gradio/client";

async function test() {
  try {
    console.log("Connecting to Gradio space...");
    const app = await client("yisol/IDM-VTON");
    
    const humanUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    const garmentUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

    console.log("Making prediction with handle_file...");
    const result = await app.predict("/tryon", [
        { "background": handle_file(humanUrl), "layers": [], "composite": null },
        handle_file(garmentUrl),
        "A fashion garment",
        true,
        false,
        30,
        42,
    ]);

    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
