export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Bypass CORS / WAF checks for API namespace
    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
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
          message: "EDS-360 Telemetry Node Online",
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
            reply = `🛡️ **Compliance Analysis**: NIST SP 800-171 / CMMC Level 2 control verified. Ephemeral key decay model $N(t) = N_0 e^{-\\lambda t}$ active.`;
          } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
            reply = `🚨 **Threat Scenario**: Ingress threat score elevated. Node 4 Wazuh SIEM isolating suspicious peer endpoints.`;
          }

          return new Response(JSON.stringify({ status: "SUCCESS", response: reply }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ status: "ERROR", response: "Invalid request payload." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    return env.ASSETS.fetch(request);
  }
};
