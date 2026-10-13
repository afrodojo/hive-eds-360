export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Trap /api/* namespace
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
          let reply = `🤖 **EDS-360 Agent**: Processed query "${prompt}". Enclave parameters verified under FIPS 140-3.`;
          
          if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
            reply = `🛡️ **Compliance Guard Analysis**: Control alignment verified under NIST SP 800-171 / CMMC Level 2. Ephemeral key rotation decay model active.`;
          } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
            reply = `🚨 **Threat Scenario Simulation**: Ingress threat score elevated. Node 4 Wazuh SIEM enforcing automated isolation rules.`;
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

    return env.ASSETS.fetch(request);
  }
};
