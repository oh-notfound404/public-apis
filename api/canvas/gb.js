const knights = require("knights-canvas");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "goodbye",
  version: "1.0.0",
  description: "Generate a goodbye canvas image",
  author: "Developer",
  method: "get",
  category: "canvas",
  path: "/goodbye?pp=&name=&bg=&member="
};

async function onStart({ req, res }) {
  try {
    const { pp, name, bg, member } = req.query;

    if (!pp || !name || !bg || !member) {
      return res.status(400).json({
        error: "Missing parameters. Use ?pp=&nama=&bg=&member="
      });
    }

    const image = await new knights.Goodbye2()
      .setAvatar(pp)
      .setUsername(name)
      .setBg(bg)
      .setMember(member)
      .toAttachment();

    const imageBuffer = image.toBuffer();

    const tempDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, `goodbye_${Date.now()}.png`);
    await fs.promises.writeFile(filePath, imageBuffer);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Failed to send image" });
      }
    });

    res.on("finish", () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error("Error generating goodbye image:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { meta, onStart };