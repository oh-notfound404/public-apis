const meta = {
  name: "tiktok",
  version: "1.0.0",
  description: "Download TikTok videos",
  author: "Developer",
  method: "get",
  category: "search",
  path: "/tiktok?query="
};

const axios = require("axios");

async function onStart({ req, res }) {
  let { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: false, error: "add ?query=your_query_here" });
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://tikwm.com/api/feed/search",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      },
      data: {
        keywords: query,
        count: 50,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (!videos || videos.length === 0) {
      return res.status(404).json({ status: false, error: "No videos found." });
    }

    const videorndm = videos[Math.floor(Math.random() * videos.length)];

    res.json({
      title: videorndm.title,
      cover: videorndm.cover,
      origin_cover: videorndm.origin_cover,
      no_watermark: videorndm.play,
      watermark: videorndm.wmplay,
      music: videorndm.music
    });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to fetch TikTok videos" });
  }
}

module.exports = { meta, onStart };