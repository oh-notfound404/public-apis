const axios = require("axios");

const meta = {
  name: "aigf",
  version: "1.0.0",
  method: "get",
  category: "ai",
  path: "/aigf?message=",
};

async function onStart({ req, res }) {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: "Add ?message=hi babe" });
    }

    const url = "https://www.pinoygpt.com/api/generate_ai_girlfriend.php";

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Dalvik/2.1.0 (Linux; U; Android 8.1.0; S24+ Build/O11019) AppleWebKit [PB/187] (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36",
      Referer: "https://www.pinoygpt.com/ai-girlfriend",
    };

    const data = { message };

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      res.json({ response: response.data.response });
    } else if (response.status === 403) {
      res.status(403).json({ error: "403 Forbidden. Try running again later." });
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to chat with AI girlfriend" });
  }
}

module.exports = { meta, onStart };