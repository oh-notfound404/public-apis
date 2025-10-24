const axios = require('axios');
const fs = require('fs');

const meta = {
  name: 'GPT-4 (Conversational)',
  path: '/gpt4-convo?prompt=&uid=',
  method: 'get',
  category: 'ai'
};

const convoFile = 'convo.json';
const apiUrl = 'https://www.pinoygpt.com/api/chat_response.php';

// Ensure the conversation file exists
if (!fs.existsSync(convoFile)) {
  fs.writeFileSync(convoFile, JSON.stringify({}), 'utf-8');
}

function loadConversation(uid) {
  const convos = JSON.parse(fs.readFileSync(convoFile, 'utf-8'));
  return convos[uid] || [];
}

function saveConversation(uid, messages) {
  const convos = JSON.parse(fs.readFileSync(convoFile, 'utf-8'));
  convos[uid] = messages;
  fs.writeFileSync(convoFile, JSON.stringify(convos, null, 2), 'utf-8');
}

function clearConversation(uid) {
  const convos = JSON.parse(fs.readFileSync(convoFile, 'utf-8'));
  delete convos[uid];
  fs.writeFileSync(convoFile, JSON.stringify(convos, null, 2), 'utf-8');
}

async function onStart({ req, res }) {
  const { prompt, uid } = req.query;

  if (!prompt || !uid) {
    return res.status(400).json({
      error: 'Both prompt and uid parameters are required',
      example: '/gpt4-convo?prompt=hello&uid=123'
    });
  }

  try {
    // Handle "clear" command
    if (prompt.toLowerCase() === 'clear') {
      clearConversation(uid);
      return res.json({ message: 'Conversation history cleared.' });
    }

    // Load conversation history
    let conversation = loadConversation(uid);

    // Add user message
    conversation.push({ role: 'user', content: prompt });

    // Combine conversation as context for API
    const messageText = conversation
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Send request to GPT-4 conversational API
    const response = await axios.post(
      apiUrl,
      new URLSearchParams({ message: messageText }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    );

    const text = response.data?.response || 'No response received.';

    // Add assistant reply
    conversation.push({ role: 'assistant', content: text });
    saveConversation(uid, conversation);

    res.json({
      status: true,
      creator: 'Ry',
      response: text
    });

  } catch (error) {
    console.error('GPT-4 Conversational Error:', error.message);
    res.status(500).json({
      status: false,
      error: 'Failed to get response from GPT-4 conversational API'
    });
  }
}

module.exports = { meta, onStart };