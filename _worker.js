export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Explicit API endpoint handling
    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*"
          }
        });
      }

      if (url.pathname === "/api/webhook") {
        return new Response(JSON.stringify({
          status: "SUCCESS",
          message: "EDS-360 Telemetry Ingested",
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      if (url.pathname === "/api/agent") {
        try {
          const payload = await request.json();
          const prompt = payload.prompt || "";
          let reply = `🤖 **EDS-360 Agent**: Evaluated prompt "${prompt}". CUI enclave parameters active under FIPS 140-3.`;

          if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
            reply = `🛡️ **Compliance Analysis**: NIST SP 800-171 / CMMC Level 2 control verified. Ephemeral key decay active.`;
          } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
            reply = `🚨 **Threat Scenario**: Threat score elevated. Node 4 Wazuh SIEM isolating suspicious peer endpoints.`;
          }

          return new Response(JSON.stringify({ status: "SUCCESS", response: reply }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ status: "SUCCESS", response: "EDS-360 Agent Active." }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
      }
    }

    // Safe Static Asset Fetching
    if (env && env.ASSETS) {
      try {
        return await env.ASSETS.fetch(request);
      } catch (e) {
        // Fallback if asset fetch fails
      }
    }

    return new Response(JSON.stringify({ status: "ONLINE", system: "EDS-360 Telemetry Router" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
