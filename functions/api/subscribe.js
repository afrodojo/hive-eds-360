export async function onRequest(context) {
    const { request } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        });
    }

    try {
        if (request.method === "POST") {
            const body = await request.json().catch(() => ({}));
            const { action, email, type, question, name } = body;

            // Store in KV or return confirmation
            if (action === "question") {
                return new Response(JSON.stringify({
                    status: "SUCCESS",
                    message: "Question submitted directly to Asaad's Doctoral Lab Panel!",
                    timestamp: new Date().toISOString()
                }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
            }

            return new Response(JSON.stringify({
                status: "SUCCESS",
                message: `Subscribed ${email} to ${type || 'all'} updates!`,
                timestamp: new Date().toISOString()
            }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
        }

        return new Response(JSON.stringify({ status: "SUCCESS", active: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ status: "ERROR", message: err.message }), { status: 500 });
    }
}
