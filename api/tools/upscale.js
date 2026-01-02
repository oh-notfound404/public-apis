const axios = require("axios");
const FormData = require("form-data");

const apiKeys = [
  "paat-HbGYMelTXZGDLsf9XWO4FbfJWMF"
  // you can add more Picsart keys here if needed
];

const meta = {
  name: "upscale",
  version: "1.0.0",
  description: "Upscale image using Picsart Ultra Upscale API",
  author: "Ry",
  method: "get",
  category: "tools",
  path: "/upscale?imageUrl=",
};

async function onStart({ req, res }) {
  try {
    const imageUrl = req.query.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ error: "Add ?imageUrl=https://..." });
    }

    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // 1️⃣ Download image
    const imgRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imgRes.data);

    // 2️⃣ Prepare form data
    const form = new FormData();
    form.append("upscale_factor", "2");
    form.append("mode", "sync");
    form.append("format", "JPG");
    form.append("image", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    // 3️⃣ Call Picsart Upscale API
    const upscaleRes = await axios.post(
      "https://api.picsart.io/tools/1.0/upscale/ultra",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Picsart-API-Key": apiKey,
          "accept": "application/json",
        },
      }
    );

    // 4️⃣ Fetch the upscaled image from returned URL
    const resultUrl = upscaleRes.data?.data?.url;
    if (!resultUrl) {
      return res.status(500).json({ error: "Upscale failed" });
    }

    const finalImage = await axios.get(resultUrl, {
      responseType: "arraybuffer",
    });

    // 5️⃣ Send image directly (no URL response)
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(finalImage.data));

  } catch (err) {
    console.error("Upscale Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to upscale image" });
  }
}

module.exports = { meta, onStart };