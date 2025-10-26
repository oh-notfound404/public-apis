const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "google-imagen",
  version: "1.0.0",
  description: "Generates AI art using Google Imagen 4.0 API",
  author: "Ry",
  method: "get",
  category: "image generation",
  path: "/google-imagen?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt parameter is required" });
    }

    // 🔑 Insert your Google API key here
    const GEMINI_API_KEY = "AIzaSyB2TTV5iIm77ZYx6YU2c_4PCZYxz7U9vlA"; // Replace this with your actual key

    const body = {
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 4,
      },
    };

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict",
      body,
      {
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Check if image data is available
    if (response.data && response.data.predictions) {
      // Optional: Save first image locally for debugging or caching
      const firstImage = response.data.predictions[0]?.image_base64;
      if (firstImage) {
        const buffer = Buffer.from(firstImage, "base64");
        const filePath = path.join(__dirname, "output.png");
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Image saved to: ${filePath}`);
      }

      res.json(response.data);
    } else {
      res.status(500).json({ error: "No image generated or invalid API response" });
    }
  } catch (error) {
    console.error("Google Imagen generation error:", error.message);
    if (error.response) {
      console.error(error.response.data);
    }
    res.status(500).json({ error: "Failed to generate image using Google Imagen" });
  }
}

module.exports = { meta, onStart };