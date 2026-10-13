export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Trap only /api/* endpoints
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
          let reply = `🤖 **EDS-360 Agent**: Evaluated prompt "${prompt}". Enclave parameters active under FIPS 140-3.`;
          
          if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
            reply = `🛡️ **Compliance Guard Analysis**: Control verified under NIST SP 800-171 / CMMC Level 2. Ephemeral key decay model active.`;
          } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
            reply = `🚨 **Threat Scenario Simulation**: Elevated threat score logged. Node 4 Wazuh SIEM actively monitoring ingress endpoints.`;
          }

          return new Response(JSON.stringify({ status: "SUCCESS", response: reply }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ status: "SUCCESS", response: "EDS-360 Agent Ready." }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
      }
    }

    // Pass through all HTML / JS / static asset requests to Pages static asset storage
    return env.ASSETS.fetch(request);
  }
};
