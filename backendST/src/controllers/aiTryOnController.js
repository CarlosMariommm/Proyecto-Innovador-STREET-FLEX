import Replicate from 'replicate';
import AI_TryOn from '../models/aiTryOnModel.js';

const aiTryOnController = {};

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate a virtual try-on using Replicate's IDM-VTON model.
 * 
 * The route uses multer middleware, so:
 * - req.file       → the user's photo (uploaded to Cloudinary, has .path = Cloudinary URL)
 * - req.body.garment_image_url → the garment/product image URL (already on Cloudinary)
 */
aiTryOnController.generateTryOn = async (req, res) => {
  try {
    const { garment_image_url } = req.body;

    // The human image comes from multer → Cloudinary upload
    const humanImageUrl = req.file?.path;

    if (!garment_image_url) {
      return res.status(400).json({ 
        message: "garment_image_url is required" 
      });
    }

    if (!humanImageUrl) {
      return res.status(400).json({ 
        message: "Please upload your photo (human_image file is required)" 
      });
    }

    console.log("🧥 Starting AI Try-On generation...");
    console.log("   Garment URL:", garment_image_url);
    console.log("   Human URL (Cloudinary):", humanImageUrl);

    // Call IDM-VTON on Replicate with the correct model ID and version
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          seed: 42,
          steps: 30,
          crop: false,
          garm_img: garment_image_url,
          human_img: humanImageUrl,
          garment_des: "A fashion garment",
        }
      }
    );

    console.log("✅ Replicate output:", output);

    // output is usually an array with URL(s)
    const resultUrl = Array.isArray(output) ? output[0] : output;

    if (!resultUrl) {
      return res.status(500).json({ message: "AI model returned no output" });
    }

    res.json({ 
      message: "Try-on generated successfully", 
      data: { result_image: resultUrl } 
    });
  } catch (error) {
    console.error("❌ Replicate AI Try-On error:", error.message);
    
    // Check for specific Replicate API errors
    if (error.response?.status === 402 || error.message?.includes('Insufficient credit')) {
       return res.status(402).json({ 
        message: "Insufficient credit on your Replicate account. Please add a payment method at replicate.com to run this model." 
      });
    }

    if (error.response?.status === 401 || error.message?.includes('Unauthenticated') || error.message?.includes('token')) {
      return res.status(401).json({ 
        message: "Invalid Replicate API token. Check REPLICATE_API_TOKEN in .env" 
      });
    }
    
    res.status(500).json({ 
      message: "Error generating try-on: " + (error.response?.data?.detail || error.message)
    });
  }
};

// Keep existing CRUD operations
aiTryOnController.createAITryOn = async (req, res) => {
  try {
    const { name, id_product, image_client, saved } = req.body;
    const tryon = await AI_TryOn.create({ name, id_product, image_client, saved });
    if (tryon) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

aiTryOnController.getAITryOns = async (req, res) => {
  try {
    const tryons = await AI_TryOn.find({}).populate('id_product');
    res.json({ message: "Action done", data: tryons });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default aiTryOnController;
