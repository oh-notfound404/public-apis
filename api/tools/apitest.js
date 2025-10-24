const axios = require("axios");

const meta = {
  name: "apitest",
  version: "68.0.0",
  description: "API tester — send a GET request to any endpoint",
  author: "Developer",
  method: "get",
  category: "tools",
  path: "/apitest?url="
};

async function onStart({ req, res }) {
  try {
    const url = req.query.url;

    if (!url || !/^https?:\/\//.test(url)) {
      return res.status(400).json({
        status: false,
        error: "Please provide a valid 'url' parameter with http(s) protocol."
      });
    }

    const response = await axios.get(url, {
      headers: { Accept: "application/json" }
    });

    if (typeof response.data !== "object") {
      return res.status(400).json({
        status: false,
        error: "Invalid JSON response from the provided API."
      });
    }

    res.status(200).json({
      status: true,
      message: "Request successful.",
      response: response.data,
      author: meta.author
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
}

module.exports = { meta, onStart };