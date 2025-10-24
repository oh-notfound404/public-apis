const { TempMail } = require("tempmail.lol");
const { tokenCache } = require("./tempmailgen");

const meta = {
  name: "tempmail-inbox",
  version: "1.0.0",
  method: "get",
  category: "tempmail",
  path: "/tempmail-inbox?email="
};

async function onStart({ req, res }) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      error: "Missing required 'email' parameter.",
      exampleUsage: "/tempmail-inbox?email=temp@domain.com"
    });
  }

  const token = tokenCache[email];
  if (!token) {
    return res.status(404).json({
      error: `Token not found for ${email}. Please generate using /tempmailgen first.`
    });
  }

  try {
    const tempmail = new TempMail();
    const messages = await tempmail.checkInbox(token);

    if (!messages || messages.length === 0) {
      return res.json({ message: "📭 Inbox is empty or expired." });
    }

    const latest = messages[0];
    const content = latest.body || "";
    const chunks = [];

    for (let i = 0; i < content.length; i += 1900) {
      chunks.push(content.slice(i, i + 1900));
    }

    return res.json({
      from: latest.from,
      subject: latest.subject,
      date: new Date(latest.date).toLocaleString(),
      chunks,
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to check inbox.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = { meta, onStart };