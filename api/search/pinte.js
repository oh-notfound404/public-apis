const axios = require("axios");
const cheerio = require("cheerio");

const meta = {
  name: "pinterest",
  version: "1.0.0",
  method: "get",
  category: "search",
  path: "/pinterest?q=&amount="
};

async function fetchPinterestImages(query) {
  try {
    const { data } = await axios.get(`https://id.pinterest.com/search/pins/?autologin=true&q=${encodeURIComponent(query)}`, {
      headers: {
        cookie: "_auth=1; _b=\"AXOtdcLOEbxD+qMFO7SaKFUCRcmtAznLCZY9V3z9tcTqWH7bPo637K4f9xlJCfn3rl4=\"; _pinterest_sess=TWc9PSZWcnpkblM5U1pkNkZ0dzZ6NUc5WDZqZEpGd2pVY3A0Y2VJOGg0a0J0c2JFWVpQalhWeG5iTTRJTmI5R08zZVNhRUZ4SmsvMG1CbjBWUWpLWVFDcWNnNUhYL3NHT1EvN3RBMkFYVUU0T0dIRldqVVBrenVpbGo5Q1lONHRlMzBxQTBjRGFSZnFBcTdDQVgrWVJwM0JtN3VRNEQyeUpsdDYreXpYTktRVjlxb0xNanBodUR1VFN4c2JUek1DajJXbTVuLzNCUDVwMmRlZW5VZVpBeFQ5ZC9oc2RnTGpEMmg4M0Y2N2RJeVo2aGNBYllUYjRnM05VeERzZXVRUVVYNnNyMGpBNUdmQ1dmM2s2M0txUHRuZTBHVFJEMEE1SnIyY2FTTm9DUEVTeWxKb3V0SW13bkV3TldyOUdrdUZaWGpzWmdaT0JlVnhWb29xWTZOTnNVM1NQSzViMkFUTjBpRitRRVMxaUFxMEJqell1bVduTDJid2l3a012RUgxQWhZT1M3STViSVkxV0dSb1p0NTBYcXlqRU5nPT0ma25kRitQYjZJNTVPb2tyVnVxSWlleEdTTkFRPQ==; _ir=0" // Replace with valid cookie if needed
      }
    });

    const $ = cheerio.load(data);
    const result = [];

    $("div > a img").each((_, el) => {
      const src = $(el).attr("src");
      if (src) result.push(src.replace(/236/g, "736"));
    });

    // Remove the first image which is often not relevant
    if (result.length > 0) result.shift();

    return result;
  } catch (err) {
    throw new Error("Failed to fetch Pinterest images: " + err.message);
  }
}

async function onStart({ req, res }) {
  try {
    const { q = "", amount = 6 } = req.query;

    if (!q) {
      return res.json({
        message: "Missing search query. Example usage: /pinterest?q=cat&amount=5"
      });
    }

    const results = await fetchPinterestImages(q.trim());
    const limited = results.slice(0, Math.min(parseInt(amount), results.length));

    res.json({
      message: "success",
      query: q,
      count: limited.length,
      results: limited
    });
  } catch (error) {
    res.json({
      message: "error",
      error: error.message
    });
  }
}

module.exports = { meta, onStart };
