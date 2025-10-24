const axios = require('axios');

const meta = {
  name: 'summarize',
  path: '/summarize?text=',
  method: 'get',
  category: 'ai'
};

async function onStart({ req, res }) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Missing 'text' query parameter.",
      example: '/summarize?text=Artificial intelligence is a branch of computer science...'
    });
  }

  try {
    // Send POST request to summarizer API
    const response = await axios.post(
      'https://www.pinoygpt.com/api/generate_ai_summarizer.php',
      { text },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;

    const summary =
      data?.summary ||
      data?.result ||
      data?.output ||
      data?.response ||
      data?.message ||
      'No summarized result found.';

    res.json({
      status: true,
      summary
    });

  } catch (error) {
    console.error('AI Summarize Error:', error.message);
    res.status(500).json({
      status: false,
      error: 'Failed to fetch summarized result.'
    });
  }
}

module.exports = { meta, onStart };