const axios = require("axios");

const meta = {
  name: "paraphrase",
  version: "1.0.0",
  method: "get",
  category: "ai",
  path: "/paraphrase?text="
};

async function onStart({ res, req }) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' query parameter." });
  }

  try {
    const response = await axios.post(
      "https://www.pinoygpt.com/api/generate_paraphrase.php",
      { text },
      { headers: { "Content-Type": "application/json" } }
    );

    const paraphrased = response.data?.paraphrased || "No paraphrased result";

    return res.json({
      original: text,
      paraphrased
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch paraphrased result.",
      message: error.message
    });
  }
}

module.exports = { meta, onStart };