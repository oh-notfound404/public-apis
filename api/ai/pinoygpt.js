const fs = require("fs");
const axios = require("axios");

const meta = {
  name: "pinoygpt",
  version: "1.0.1",
  description: "Makipag ugnayan sa PinoyGPT",
  method: "get",
  category: "ai",
  path: "/pinoygpt?prompt=&uid="
};

const url = "https://www.pinoygpt.com/api/chatgpt_tagalog.php";
const conversationFile = "convo.json";

if (!fs.existsSync(conversationFile)) {
  fs.writeFileSync(conversationFile, JSON.stringify({}), "utf-8");
}

function loadConversation(uid) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  return conversations[uid] || [];
}

function saveConversation(uid, messages) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  conversations[uid] = messages;
  fs.writeFileSync(conversationFile, JSON.stringify(conversations, null, 2), "utf-8");
}

function clearConversation(uid) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  delete conversations[uid];
  fs.writeFileSync(conversationFile, JSON.stringify(conversations, null, 2), "utf-8");
}

async function onStart({ req, res }) {
  try {
    const userPrompt = req.query.prompt;
    const uid = req.query.uid;

    if (!userPrompt || !uid) {
      return res.status(400).json({ error: "Gamitin ang format: ?prompt=kamusta&uid=1" });
    }

    if (userPrompt.toLowerCase() === "clear") {
      clearConversation(uid);
      return res.json({ message: "Na-clear na ang conversation history mo." });
    }

    let conversationHistory = loadConversation(uid);
    conversationHistory.push({ role: "user", content: userPrompt });

    const formattedConversation = conversationHistory
      .map(m => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const response = await axios.post(
      url,
      { message: formattedConversation },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    const botReply =
      data?.reply ||
      data?.response ||
      data?.message ||
      data?.result ||
      "Pasensya na, walang sagot na nakuha.";

    conversationHistory.push({ role: "AI", content: botReply });
    saveConversation(uid, conversationHistory);

    res.json({
      response: botReply
    });

  } catch (error) {
    res.status(500).json({
      error: "Nabigong kunin ang sagot mula sa PinoyGPT.",
      message: error.message
    });
  }
}

module.exports = { meta, onStart };