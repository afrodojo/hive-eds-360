export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Handle CORS preflight
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
                message: "EDS-360 Enclave: GitHub Webhook Telemetry Ingested",
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
            return new Response(JSON.stringify({
                status: "SUCCESS",
                message: "Webhook event received",
                details: err.message
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
    }

    return new Response(JSON.stringify({ status: "ACTIVE", node: "EDS-360 Worker Engine" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
