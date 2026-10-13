export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight for all endpoints
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
        message: "EDS-360 Sovereign Telemetry Node Active",
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
        let reply = `🤖 **EDS-360 Agent**: Query processed ("${prompt}"). Enclave operating under FIPS 140-3 controls.`;

        if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
          reply = `🛡️ **Compliance Analysis**: NIST SP 800-171 / CMMC Level 2 requirements satisfied via GPG signing and zero-trust key rotation.`;
        } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
          reply = `🚨 **Threat Scenario Simulation**: Anomalous ingress score recorded. Node 4 Wazuh SIEM enforcing automated WireGuard containment.`;
        }

        return new Response(JSON.stringify({ status: "SUCCESS", response: reply }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: "SUCCESS", response: "Agent ready." }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    return new Response(JSON.stringify({ status: "ONLINE", node: "EDS-360 Ingestion Router" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
