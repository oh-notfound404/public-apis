const axios = require("axios");

const HEADERS = {
  Authorization: `Client-ID e4f58fc81daec99`,
  "User-Agent":
    "Dalvik/2.1.0 (Linux; U; Android 8.1.0; S24+ Build/O11019) AppleWebKit [PB/187] (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36",
};

const meta = {
  name: "imgur",
  version: "1.0.0",
  method: "get",
  category: "tools",
  path: "/imgur?url=",
};

async function onStart({ req, res }) {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Add ?url=image_link_here" });
    }

    const payload = { image: imageUrl };
    const response = await axios.post("https://api.imgur.com/3/image", payload, {
      headers: HEADERS,
    });

    const data = response.data;
    if (data.success) {
      return res.json({
        url: data.data.link,
      });
    } else {
      return res.status(500).json({ error: "Upload failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
}

module.exports = { meta, onStart };