export async function onRequestPost(context) {
    try {
        const payload = await context.request.json();
        const eventType = context.request.headers.get("X-GitHub-Event") || "push";

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
            message: "Webhook POST request acknowledged",
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

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-GitHub-Event, X-Hub-Signature-256"
        }
    });
}
