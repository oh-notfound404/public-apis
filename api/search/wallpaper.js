const axios = require("axios");
const cheerio = require("cheerio");

const meta = {
  name: "wallpaper",
  version: "1.0.0",
  method: "get",
  category: "search",
  path: "/wallpaper?prompt=&page="
};

// Core scraping function
async function wallpaperSearch(query, page = "1") {
  const url = `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${encodeURIComponent(query)}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const results = [];

  $("div.grid-item").each((_, el) => {
    results.push({
      title: $(el).find("div.info > a > h3").text().trim(),
      type: $(el).find("div.info > a:nth-child(2)").text().trim(),
      source: "https://www.besthdwallpaper.com" + $(el).find("div > a:nth-child(3)").attr("href"),
      image: $(el).find("picture > source:nth-child(2)").attr("srcset")
    });
  });

  return results;
}

// API entrypoint
async function onStart({ req, res }) {
  try {
    const { prompt, page = "1" } = req.query;
    if (!prompt) {
      return res.json({
        status: false,
        message: "❗ Please provide a 'prompt' parameter"
      });
    }

    const results = await wallpaperSearch(prompt, page);

    if (!results.length) {
      return res.json({
        status: false,
        message: "⚠️ No wallpapers found for your search"
      });
    }

    res.json({
      status: true,
      author: meta.author,
      count: results.length,
      results
    });
  } catch (err) {
    console.error("Error:", err);
    res.json({
      status: false,
      message: "An error occurred while fetching wallpapers",
      error: err.message
    });
  }
}

module.exports = { meta, onStart };