export async function onRequest(context) {
    const { request } = context;

    // Direct Preflight Handling
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

    // Ingest telemetry payload safely
    try {
        const body = await request.json().catch(() => ({}));
        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "EDS-360 Telemetry Node Ingested",
            event: request.headers.get("X-GitHub-Event") || "telemetry_pulse",
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ status: "SUCCESS", message: "Node Pulse Active" }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
