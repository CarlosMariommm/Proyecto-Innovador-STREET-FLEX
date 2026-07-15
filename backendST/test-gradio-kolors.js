import { client } from "@gradio/client";

async function test() {
  try {
    console.log("Connecting to Gradio space Kwai-Kolors/Kolors-Virtual-Try-On...");
    const app = await client("Kwai-Kolors/Kolors-Virtual-Try-On");
    
    console.log("API Docs:");
    const apiInfo = await app.view_api();
    console.log(JSON.stringify(apiInfo, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
