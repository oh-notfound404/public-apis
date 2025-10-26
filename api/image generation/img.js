const axios = require("axios");

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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment variables" });
    }

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
          "x-goog-api-key": AIzaSyB2TTV5iIm77ZYx6YU2c_4PCZYxz7U9vlA,
          "Content-Type": "application/json",
        },
      }
    );

    // The API typically returns base64-encoded images or URLs — adjust based on response structure.
    if (response.data && response.data.predictions) {
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