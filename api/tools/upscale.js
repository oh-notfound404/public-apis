const axios = require("axios");
const FormData = require("form-data");
const stream = require("stream");

const meta = {
    name: "Upscale",
    version: "1.0.0",
    author: "rapidboots",
    category: "tools",
    method: "GET",
    path: "/upscale?imageUrl="
};

async function onStart({ res, req }) {
    const { imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400).json({ error: "imageUrl parameter required" });
    }

    try {
        // 1️⃣ Download image as buffer
        const imageResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer"
        });

        // Convert buffer to stream
        const bufferStream = new stream.PassThrough();
        bufferStream.end(imageResponse.data);

        // 2️⃣ Create multipart form
        const form = new FormData();
        form.append("upscale_factor", "2");
        form.append("mode", "sync");
        form.append("format", "JPG");
        form.append("image", bufferStream, {
            filename: "image.jpg",
            contentType: "image/jpeg"
        });

        // 3️⃣ Send to PicsArt API
        const response = await axios.post(
            "https://api.picsart.io/tools/1.0/upscale/ultra",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    "X-Picsart-API-Key": "paat-HbGYMelTXZGDLsf9XWO4FbfJWMF",
                    "accept": "application/json"
                },
                maxBodyLength: Infinity
            }
        );

        // 4️⃣ Return clean response
        res.json({
            status: "success",
            id: response.data.data.id,
            url: response.data.data.url,
            transaction_id: response.data.transaction_id
        });

    } catch (error) {
        res.status(500).json({
            error: "Upscale failed",
            details: error.response?.data || error.message
        });
    }
}

module.exports = { meta, onStart };