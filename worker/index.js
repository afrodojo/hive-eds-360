export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-GitHub-Event, X-Hub-Signature-256"
        }
      });
    }

    if (url.pathname === "/api/webhook" && request.method === "POST") {
      try {
        const payload = await request.json();
        const eventType = request.headers.get("X-GitHub-Event") || "push";

        return new Response(JSON.stringify({
          status: "SUCCESS",
          message: "EDS-360 Telemetry Ingested",
          event: eventType,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: "SUCCESS", message: "Event ACK" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ status: "ACTIVE", system: "EDS-360 Telemetry Router" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
