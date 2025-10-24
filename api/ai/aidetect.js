const axios = require('axios');

const meta = {
  name: 'ai-detector',
  path: '/ai-detector?text=',
  method: 'get',
  category: 'ai'
};

async function onStart({ req, res }) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Missing 'text' query parameter.",
      example: '/ai-detector?text=This%20is%20an%20example%20text'
    });
  }

  try {
    // Send POST request to AI detector API
    const response = await axios.post(
      'https://www.pinoygpt.com/api/generate_ai_detector.php',
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    );

    const data = response.data;

    const result =
      data?.result ||
      data?.output ||
      data?.response ||
      data?.message ||
      'No detection result found.';

    res.json({
      status: true,
      result
    });

  } catch (error) {
    console.error('AI Detector Error:', error.message);
    res.status(500).json({
      status: false,
      error: 'Failed to check AI-generated text.'
    });
  }
}

module.exports = { meta, onStart };