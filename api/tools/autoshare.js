ito script

const axios = require("axios");
const qs = require("querystring");

const meta = {
  name: "spam-share",
  version: "1.0.0",
  description: "Facebook post sharer",
  author: "Vern and Ry",
  method: "get",
  category: "other",
  path: "/autoshare?cookie=&link=&limit="
};

const uaList = [
  "Mozilla/5.0 (Linux; Android 10; Wildfire E Lite) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.5195.136 Mobile Safari/537.36[FBAN/EMA;FBLC/en_US;FBAV/298.0.0.10.115;]",
  "Mozilla/5.0 (Linux; Android 11; KINGKONG 5 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/320.0.0.12.108;]",
  "Mozilla/5.0 (Linux; Android 11; G91 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36[FBAN/EMA;FBLC/fr_FR;FBAV/325.0.1.4.108;]"
];

// extract EAAG token from business.facebook.com using Cookie header
async function extractToken(cookie, ua) {
  try {
    const res = await axios.get("https://business.facebook.com/business_locations", {
      headers: {
        "User-Agent": ua,
        "Referer": "https://www.facebook.com/",
        "Cookie": cookie,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      timeout: 15000
    });

    const match = String(res.data).match(/(EAAG\w+)/);
    return match ? match[1] : null;
  } catch (err) {
    console.error("❌ Token extraction failed:", err.message || err);
    return null;
  }
}

function parseCookiesToObject(cookie) {
  const out = {};
  cookie.split(";").forEach(part => {
    const [k, ...v] = part.split("=");
    if (!k || v.length === 0) return;
    out[k.trim()] = v.join("=").trim();
  });
  return out;
}

async function sharePost(token, cookiesObj, link, n, start, ua) {
  try {
    const postBody = qs.stringify({
      link,
      access_token: token
    });

    const response = await axios.post(
      "https://graph.facebook.com/v18.0/me/feed",
      postBody,
      {
        headers: {
          "User-Agent": ua,
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": Object.entries(cookiesObj).map(x => x.join("=")).join("; ")
        },
        timeout: 15000
      }
    );

    if (response.data.id) {
      let diff = Math.floor((Date.now() - start) / 1000);
      return { n, status: 'success', time: diff };
    } else {
      return { n, status: 'failed', data: response.data };
    }
  } catch (e) {
    return { n, status: 'error', message: e.message };
  }
}

async function onStart({ req, res }) {
  try {
    // from query (GET)
    const { cookie, link, limit } = req.query;

    if (!cookie || !link || !limit) {
      return res.status(400).json({
        status: false,
        message: "Missing 'cookie', 'link', or 'limit' query parameter. Example: /fb-share?cookie=...&link=...&limit=3"
      });
    }

    const ua = uaList[Math.floor(Math.random() * uaList.length)];
    const token = await extractToken(cookie, ua);

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token extraction failed. Invalid or expired cookie."
      });
    }

    const cookiesObj = parseCookiesToObject(cookie);
    const tries = Math.max(0, Number(limit));

    const start = Date.now();
    const chunk = 40;
    let n = 1;
    let results = [];

    while (n <= tries) {
      let batch = [];
      for (let i = 0; i < chunk && n <= tries; i++, n++) {
        batch.push(sharePost(token, cookiesObj, link, n, start, ua));
      }
      let settled = await Promise.allSettled(batch);
      results.push(...settled.map(s => s.status === 'fulfilled' ? s.value : { n: s.reason.n, status: 'error', message: s.reason.message }));
      if (n <= tries) {
        await new Promise(r => setTimeout(r, 10000));
      }
    }

    const success = results.filter(r => r.status === 'success').length;

    return res.status(200).json({
      status: true,
      message: `✅ Successfully shared ${success} times.`,
      success_count: success,
      used_token: !!token,
      results
    });

  } catch (error) {
    console.error("❌ FB-Share Error:", error.message || error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message || error
    });
  }
}

module.exports = { meta, onStart };