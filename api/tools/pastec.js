const axios = require('axios');

const meta = {
  name: 'paste-c',
  path: '/paste-c?code=',
  method: 'get',
  category: 'tools'
};

async function onStart({ req, res }) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      status: false,
      error: "Missing 'code' query parameter.",
      example: "/paste-c?code=console.log('Hello');"
    });
  }

  try {
    // Upload the code snippet to paste.c-net.org
    const response = await axios.post('https://paste.c-net.org/', code, {
      headers: { 'X-FileName': 'snippet.txt' }
    });

    res.json({
      status: true,
      url: response.data
    });

  } catch (error) {
    console.error('Paste-C Upload Error:', error.message);
    res.status(500).json({
      status: false,
      error: 'Failed to upload code snippet.'
    });
  }
}

module.exports = { meta, onStart };