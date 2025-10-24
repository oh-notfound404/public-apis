const { TempMail } = require("tempmail.lol");

const tokenCache = {}; // In-memory cache

const meta = {
  name: "tempmail-create",
  version: "1.0.0",
  description: "Generate a temporary email address.",
  author: "Ry",
  method: "get",
  category: "tempmail",
  path: "/tempmail-create"
};

async function onStart({ req, res }) {
  try {
    const tempmail = new TempMail();
    const inbox = await tempmail.createInbox();

    // Store token for inbox use
    tokenCache[inbox.address] = inbox.token;

    return res.json({
      success: true,
      email: inbox.address,
      message: ` :))`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to generate temporary email.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = { meta, onStart, tokenCache };