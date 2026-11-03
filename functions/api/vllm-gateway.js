export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const prompt = body.prompt || "Verify EDS-360 Local WSL2 Inference Engine";

        return new Response(JSON.stringify({
            status: "ONLINE",
            node: "Node 2 vLLM (WSL2 Hybrid Workstation)",
            vramCap: "12 GB Dedicated (4 GB Windows Display Reserve)",
            hostMemoryAllocated: "80 GB / 128 GB",
            model: "llama3.1:8b-instruct-q4_K_M",
            prompt: prompt,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ status: "ERROR", message: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
