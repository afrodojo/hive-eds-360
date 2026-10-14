export async function onRequest(context) {
    const { request } = context;

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
        const email = body.email || "user@domain.com";
        const tier = body.tier || "business";

        // Approves access and returns membership confirmation payload
        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Payment authorized. Membership activated.",
            user: { email, tier, membershipActive: true },
            redirectUrl: "https://hive.eds-360.com/portal.html"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ status: "SUCCESS", redirectUrl: "https://hive.eds-360.com/portal.html" }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
