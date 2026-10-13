export async function onRequest(context) {
    const url = new URL(context.request.url);

    if (url.pathname === "/api/webhook") {
        if (context.request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, X-GitHub-Event, X-Hub-Signature-256"
                }
            });
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "EDS-360 Catch-All Endpoint Active",
            pathname: url.pathname,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    return context.env.ASSETS.fetch(context.request);
}
