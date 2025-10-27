const { GoogleGenAI } = require("@google/genai");

const meta = {
  name: "gemini",
  version: "1.0.0",
  description: "Interact with Gemini",
  author: "Developer",
  method: "get",
  category: "ai",
  path: "/gemini?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Add ?prompt=your question here" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "AIzaSyAr1FkJ8nMm2EFbEycPRrsZcOEu2AtVQyQ",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (err) {
    console.error("Error generating AI content:", err);
    res.status(500).json({ error: "Failed to generate AI content" });
  }
}

module.exports = { meta, onStart };