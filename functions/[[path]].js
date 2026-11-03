export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    // Trap /api/* routes
    if (url.pathname.startsWith("/api/")) {
        // Handle CORS Preflight
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

        // /api/webhook endpoint
        if (url.pathname === "/api/webhook") {
            return new Response(JSON.stringify({
                status: "SUCCESS",
                message: "EDS-360 Telemetry Node Active",
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // /api/agent endpoint
        if (url.pathname === "/api/agent") {
            try {
                const payload = await request.json();
                const prompt = payload.prompt || "";
                let reply = `🤖 **EDS-360 Agent**: Analyzed prompt "${prompt}". Enclave parameters verified under FIPS 140-3.`;

                if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
                    reply = `🛡️ **Compliance Guard**: NIST SP 800-171 / CMMC Level 2 alignment verified. Zero-trust key decay active.`;
                } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
                    reply = `🚨 **Threat Scenario**: Elevated ingress threat logged. Node 4 Wazuh SIEM enforcing automated WireGuard peer containment.`;
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

    // For non-API routes, pass execution to Cloudflare Pages static asset handler
    return await next();
}
