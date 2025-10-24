const axios = require("axios");
const cheerio = require("cheerio");

const meta = {
  name: "webster",
  version: "1.0.0",
  description: "Fetches word definitions, pronunciations, and examples from Merriam-Webster Dictionary.",
  author: "JohnDev19",
  category: "search",
  method: "get",
  path: "/webster?word="
};

async function onStart({ req, res }) {
  try {
    const { word } = req.query;
    if (!word) {
      return res.status(400).json({ error: "❗ 'word' parameter is required" });
    }

    const url = `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const result = {
      status: true,
      author: meta.author,
      api_info: meta,
      wordOfTheDay: {},
      word: $(".hword").first().text() || word,
      partOfSpeech: $(".important-blue-link").first().text().trim(),
      pronunciation: {
        spelled: $(".word-syllables-entry").first().text().trim(),
        phonetic: $(".prs .pr").first().text().trim(),
        audioUrl: $(".play-pron > a").first().attr("data-file") || null
      },
      definitions: [],
      examples: []
    };

    // Extract definitions
    $(".dtText").each((i, elem) => {
      let definition = $(elem).text().trim();
      if (definition.startsWith(":")) {
        definition = `${i + 1}. ${definition.slice(1).trim()}`;
      }
      if (definition) result.definitions.push(definition);
    });

    // Extract examples
    $(".ex-sent").each((i, elem) => {
      const example = $(elem).text().trim();
      if (example) result.examples.push(`${i + 1}. ${example}`);
    });

    // Extract Word of the Day
    const wotdWord = $(".wotd-side__headword").first().text().trim();
    const wotdUrl = $(".wotd-side__headword a").first().attr("href");
    if (wotdWord && wotdUrl) {
      result.wordOfTheDay = {
        word: wotdWord,
        url: `https://www.merriam-webster.com${wotdUrl}`
      };
    }

    // Handle no results
    if (!result.definitions.length && !result.examples.length) {
      return res.json({
        status: false,
        message: `⚠️ No results found for '${word}'`
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching data",
      error: error.message
    });
  }
}

module.exports = { meta, onStart };