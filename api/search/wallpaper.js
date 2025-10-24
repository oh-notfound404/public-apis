const axios = require("axios");
const cheerio = require("cheerio");

const meta = {
  name: "wallpaper",
  version: "1.0.2",
  method: "get",
  category: "search",
  path: "/wallpaper?query=&limit=&page="
};

// Core scraper
async function wallpaperSearch(query, page = 1, limit = 10) {
  const url = `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${encodeURIComponent(query)}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const results = [];

  $("div.grid-item").each((_, el) => {
    const title = $(el).find("div.info > a > h3").text().trim();
    const type = $(el).find("div.info > a:nth-child(2)").text().trim();
    const source = "https://www.besthdwallpaper.com" + $(el).find("div > a:nth-child(3)").attr("href");
    const image = $(el).find("picture > source:nth-child(2)").attr("srcset");

    if (title && image) {
      results.push({ title, type, source, image });
    }
  });

  return results.slice(0, Number(limit));
}

// Main entry
async function onStart({ req, res }) {
  try {
    const { query, limit = 10, page = 1 } = req.query;

    if (!query) {
      return res.json({
        status: false,
        message: "❗ Please provide a 'query' parameter"
      });
    }

    const results = await wallpaperSearch(query, page, limit);

    if (!results.length) {
      return res.json({
        status: false,
        message: "⚠️ No wallpapers found for your search"
      });
    }

    res.json({
      status: true,
      author: meta.author,
      current_page: Number(page),
      total_returned: results.length,
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