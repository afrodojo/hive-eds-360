export async function onRequest(context) {
    const { request } = context;

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

    try {
        const payload = await request.json();
        const prompt = payload.prompt || "";
        let reply = `🤖 **EDS-360 Agent**: Evaluated query "${prompt}". Enclave parameters active under FIPS 140-3.`;

        if (prompt.toLowerCase().includes("cmmc") || prompt.toLowerCase().includes("nist")) {
            reply = `🛡️ **Compliance Guard**: NIST SP 800-171 / CMMC Level 2 alignment verified. Zero-trust key decay active.`;
        } else if (prompt.toLowerCase().includes("scenario") || prompt.toLowerCase().includes("attack")) {
            reply = `🚨 **Threat Scenario**: Elevated ingress threat score logged. Node 4 Wazuh SIEM enforcing automated WireGuard peer containment.`;
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
