const axios = require("axios");

const meta = {
  name: "fbshield",
  version: "1.1.0",
  description: "Enable or disable Facebook Profile Guard using cookie.",
  author: "Ry",
  method: "get",
  category: "tools",
  path: "/fbshield?cookie=&enable="
};

async function onStart({ res, req }) {
  const { cookie, enable } = req.query;

  if (!cookie || typeof enable === "undefined") {
    return res.status(400).json({
      error: "Missing 'cookie' or 'enable' parameters.",
      usage: "/fbshield?cookie=sb=...; c_user=...; xs=...;&enable=true"
    });
  }

  try {
    const session_id = "9b78191c-84fd-4ab6-b0aa-19b39f04a6bc";
    const client_mutation_id = "b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0";

    const variables = {
      "0": {
        is_shielded: enable === "true",
        session_id,
        client_mutation_id
      }
    };

    const url = "https://graph.facebook.com/graphql";

    const params = new URLSearchParams({
      variables: JSON.stringify(variables),
      method: "post",
      doc_id: "1477043292367183",
      query_name: "IsShieldedSetMutation",
      strip_defaults: "false",
      strip_nulls: "false",
      locale: "en_US",
      client_country_code: "US",
      fb_api_req_friendly_name: "IsShieldedSetMutation",
      fb_api_caller_class: "IsShieldedSetMutation"
    });

    const response = await axios.post(
      `${url}?${params.toString()}`,
      null,
      {
        headers: {
          "Cookie": cookie,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return res.json({
      message: `Profile guard ${enable === "true" ? "enabled" : "disabled"} successfully.`,
      result: response.data
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to toggle Facebook profile guard.",
      reason: error.response?.data || error.message
    });
  }
}

module.exports = { meta, onStart };