const axios = require("axios");

const meta = {
  name: "token",
  version: "1.0.0",
  description: "Generate Facebook tokens using a valid Facebook cookie.",
  author: "Rei",
  method: "get",
  category: "tools",
  path: "/fbtokens?cookie="
};

async function onStart({ req, res }) {
  try {
    const { cookie } = req.query;

    if (!cookie) {
      return res.status(400).json({
        error: "Missing 'cookie' query parameter.",
        message: "Please provide a valid Facebook cookie string.",
        example: "/fbtokens?cookie=YOUR_FACEBOOK_COOKIE"
      });
    }

    const apiUrl = `https://c2t.lara.rest/${encodeURIComponent(cookie)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    const result = response.data;

    if (!result.success) {
      return res.status(500).json({
        error: "Failed to fetch tokens.",
        details: result
      });
    }

    return res.status(200).json({
      success: true,
      message: "Facebook tokens successfully generated.",
      tokens: result.tokens
    });

  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    return res.status(500).json({
      error: "Internal server error while fetching tokens.",
      details: error.message
    });
  }
}

module.exports = { meta, onStart };