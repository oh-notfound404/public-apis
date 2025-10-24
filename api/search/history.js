const axios = require("axios");

const meta = {
  name: "history",
  version: "1.0.0",
  description: "Search and retrieve historical summaries.",
  author: "Ry",
  method: "get",
  category: "search",
  path: "/history?search=",
};

async function onStart({ req, res }) {
  try {
    const search = req.query.search;
    if (!search) {
      return res.status(400).json({ error: "Missing query. Use ?search=your topic" });
    }

    const encodedSearch = encodeURIComponent(search);
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedSearch}`);

    if (response.data.title && response.data.extract) {
      return res.json({
        title: response.data.title,
        extract: response.data.extract,
      });
    } else {
      return res.status(404).json({ error: `No information found for "${search}".` });
    }
  } catch (err) {
    console.error("Error fetching historical information:", err.message);
    res.status(500).json({ error: "Failed to fetch historical information." });
  }
}

module.exports = { meta, onStart };