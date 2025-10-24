const axios = require("axios");

const meta = {
  name: "imgbb",
  version: "1.0.0",
  method: "get",
  category: "tools",
  path: "/imgbb?imageUrl="
};

async function onStart({ req, res }) {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({
      error: "Missing required parameter 'imageUrl'.",
      exampleUsage: "/imgbb?imageUrl=https://example.com/image.jpg"
    });
  }

  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", null, {
      params: {
        key: "6cafd32149a5bbc76e098eff299d2e18",
        image: imageUrl
      }
    });

    const { data } = response.data;

    // Only return image_url in the response
    res.status(200).json({
      image_url: data.url
    });

  } catch (error) {
    console.error("ImgBB upload error:", error.message);

    res.status(500).json({
      error: "Failed to upload image to ImgBB.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = { meta, onStart };