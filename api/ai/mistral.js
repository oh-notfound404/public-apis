const axios = require("axios");

const meta = {
  name: "mistral",
  version: "1.0.0",
 
  method: "get",
  category: "ai",
  path: "/mistral?prompt=",
};

async function onStart({ req, res }) {
  try {
    const userPrompt = req.query.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: "Missing ?prompt=your question" });
    }

    const API_KEY = "ICcGaAdXRx6d5EM66pohAxUPN3eTIxTa"; // Replace with your real key if needed

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-large-latest",
        messages: [{ role: "user", content: userPrompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const aiReply = response.data.choices?.[0]?.message?.content;

    if (aiReply) {
      res.json({ response: aiReply });
    } else {
      res.status(500).json({ error: "No response from Mistral API" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to get response from Mistral API",
      details: error.message,
    });
  }
}

module.exports = { meta, onStart };