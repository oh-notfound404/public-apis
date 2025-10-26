const axios = require("axios");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "google-gemini-art",
  version: "1.0.0",
  description: "Generates AI art using Google Gemini 2.5 Flash Image model",
  author: "Ry",
  method: "get",
  category: "image generation",
  path: "/google-gemini-art?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt parameter is required" });
    }

    // Gemini API endpoint
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

    // ✅ Direct API key (instead of process.env)
    const apiKey = "AIzaSyBAG9ad84ZWCDSAjey346zCgXLTjMLr3aE";

    // Prepare request body
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // Send POST request to Google Gemini API
    const response = await axios.post(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
    });

    // Extract base64 image from response
    const candidates = response.data?.candidates;
    const imageData =
      candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ||
      candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageData) {
      return res.status(500).json({ error: "No image data received from Gemini API" });
    }

    // Convert base64 to buffer and send image
    const imageBuffer = Buffer.from(imageData, "base64");
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Gemini art generation error:", error.message);
    res.status(500).json({ error: "Failed to generate image from Gemini" });
  }
}

module.exports = { meta, onStart };