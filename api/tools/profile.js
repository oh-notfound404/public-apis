const axios = require("axios");

const meta = {
  name: "profile",
  version: "1.0.0",
  description: "Fetch Facebook profile avatar by UID",
  author: "Developer",
  method: "get",
  category: "tools",
  path: "/profile?uid=",
};

async function onStart({ req, res }) {
  try {
    const uid = req.query.uid;
    if (!uid) {
      return res.status(400).json({ error: "Missing UID: use ?uid=" });
    }

    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const url = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=${accessToken}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      maxRedirects: 0,
      validateStatus: (status) => status === 302, // FB returns redirect
    });

    const redirectUrl = response.headers.location;
    if (!redirectUrl) {
      return res.status(500).json({ error: "Failed to get redirect URL" });
    }

    const img = await axios.get(redirectUrl, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.send(img.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve profile picture" });
  }
}

module.exports = { meta, onStart };