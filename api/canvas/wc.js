const knights = require("knights-canvas");
const fs = require("fs");
const path = require("path");

const meta = {
  name: "welcome",
  version: "1.0.0",
  description: "Generate a welcome canvas image",
  author: "Developer",
  method: "get",
  category: "canvas",
  path: "/welcome?username=&avatarUrl=&groupname=&bg=&memberCount=",
};

async function onStart({ req, res }) {
  try {
    const { username, avatarUrl, groupname, bg, memberCount } = req.query;

    if (!username || !avatarUrl || !groupname || !memberCount) {
      return res.status(400).json({
        error: "Missing parameters. Use ?username=&avatarUrl=&groupname=&bg=&memberCount=",
      });
    }

    const image = await new knights.Welcome2()
      .setAvatar(avatarUrl)
      .setUsername(username)
      .setBg(bg || "")
      .setGroupname(groupname)
      .setMember(memberCount)
      .toAttachment();

    const imageBuffer = image.toBuffer();

    const tempDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, `welcome_${Date.now()}.png`);
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
    console.error("Error generating welcome image:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { meta, onStart };