const axios = require('axios');

const meta = {
  name: 'ai-story',
  path: '/story?prompt=',
  method: 'get',
  category: 'ai'
};

async function onStart({ req, res }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      status: false,
      error: "Missing 'prompt' query parameter.",
      example: '/story?prompt=Once upon a time'
    });
  }

  try {
    // Send POST request to story API
    const response = await axios.post(
      'https://www.pinoygpt.com/api/generate_story.php',
      { prompt },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;

    const story =
      data?.story ||
      data?.result ||
      data?.output ||
      data?.response ||
      data?.message ||
      data?.data?.story ||
      'No story result found.';

    res.json({
      status: true,
      creator: 'Ry',
      story
    });

  } catch (error) {
    console.error('AI Story Error:', error.message);
    res.status(500).json({
      status: false,
      error: 'Failed to fetch story result.'
    });
  }
}

module.exports = { meta, onStart };