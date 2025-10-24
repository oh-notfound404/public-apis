const axios = require("axios");

const meta = {
  name: "essay",
  version: "1.0.0",
  description: "Generate an essay from given prompt",
  author: "Ry",
  method: "get",
  category: "ai",
  path: "/essay?prompt="
};

async function onStart({ res, req }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' query parameter." });
  }

  try {
    const response = await axios.post(
      "https://www.pinoygpt.com/api/generate_essay.php",
      { prompt },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;

    // Try to detect plausible fields in the response that may contain the essay
    const essay =
      data?.essay ||
      data?.result ||
      data?.output ||
      data?.response ||
      data?.message ||
      "No essay result found.";

    return res.json({
      essay
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch essay result.",
      message: error.message
    });
  }
}

module.exports = { meta, onStart };