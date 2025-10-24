const axios = require("axios");

const meta = {
  name: "bible",
  version: "1.0.0",
  description: "Get a random Bible verse",
  author: "Developer",
  method: "get",
  category: "random",
  path: "/bible"
};

async function onStart({ _, res }) {
  try {
    const response = await axios.get("https://bible-api.com/?random=verse&translation=web");
    const { text: verse, reference } = response.data;

    res.status(200).json({ reference, verse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };