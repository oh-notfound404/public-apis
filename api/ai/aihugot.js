const axios = require("axios");

const meta = {
  name: "Ai-HugotGen",
  version: "1.0.0",
  method: "get",
  category: "ai",
  path: "/hugot?keyword=",
};

async function onStart({ req, res }) {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ error: "Add ?keyword=hugot for my crush" });
    }

    const url = "https://www.pinoygpt.com/api/generate_hugot.php";

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    };

    const data = { keyword };

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      res.json({ hugot: response.data.hugot });
    } else if (response.status === 403) {
      res.status(403).json({ error: "403 Forbidden. Try running again later." });
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to generate hugot line" });
  }
}

module.exports = { meta, onStart };