const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const meta = {
  name: "gemini",
  version: "1.1.0",
  description: "Gemini Pro (Conversational)",
  author: "Developer",
  method: "get",
  category: "ai",
  path: "/gemini?prompt=&uid=",
};

const convoFile = path.join(__dirname, "convo.json");

// Ensure convo file exists
if (!fs.existsSync(convoFile)) {
  fs.writeFileSync(convoFile, JSON.stringify({}, null, 2), "utf-8");
}

function loadConversation(uid) {
  const convos = JSON.parse(fs.readFileSync(convoFile, "utf-8"));
  return convos[uid] || [];
}

function saveConversation(uid, messages) {
  const convos = JSON.parse(fs.readFileSync(convoFile, "utf-8"));
  convos[uid] = messages;
  fs.writeFileSync(convoFile, JSON.stringify(convos, null, 2), "utf-8");
}

function clearConversation(uid) {
  const convos = JSON.parse(fs.readFileSync(convoFile, "utf-8"));
  delete convos[uid];
  fs.writeFileSync(convoFile, JSON.stringify(convos, null, 2), "utf-8");
}

async function onStart({ req, res }) {
  try {
    const { prompt, uid } = req.query;

    if (!prompt || !uid) {
      return res.status(400).json({
        error: "Please include both ?prompt= and ?uid=",
        example: "/gemini?prompt=Hello&uid=123",
      });
    }

    // Handle "clear" command
    if (prompt.toLowerCase() === "clear") {
      clearConversation(uid);
      return res.json({ message: "Conversation history cleared." });
    }

    // Load conversation memory
    let conversation = loadConversation(uid);

    // Add user's new message
    conversation.push({ role: "user", text: prompt });

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "AIzaSyAr1FkJ8nMm2EFbEycPRrsZcOEu2AtVQyQ",
    });

    // Prepare conversation context
    const contents = conversation.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const textResponse =
      response.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm... I couldn't think of a reply.";

    // Save AI reply to conversation
    conversation.push({ role: "model", text: textResponse });
    saveConversation(uid, conversation);

    res.json({
      status: true,
      response: textResponse,
    });
  } catch (err) {
    console.error("Error generating AI content:", err);
    res.status(500).json({ error: "Failed to generate AI content" });
  }
}

module.exports = { meta, onStart };