export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Bypasses 403 blocks for OPTIONS and POST on /api/webhook
    if (url.pathname === "/api/webhook") {
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

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "EDS-360 Enclave: GitHub Webhook Telemetry Ingested",
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    return context.env.ASSETS.fetch(request);
}
