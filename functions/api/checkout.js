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
        const tier = (body.tier || "basic").toLowerCase();

        const stripeLinks = {
            basic: "https://buy.stripe.com/9B6aERdRY0ygdVz40p5os05",
            academic: "https://buy.stripe.com/3cI6oB7tA94M3gV68x5os06",
            business: "https://buy.stripe.com/4gM8wJ5ls5SA4kZfJ75os07",
            donation: "https://donate.stripe.com/9B6bIVaFMep68BfgNb5os04"
        };

        const redirectUrl = stripeLinks[tier] || stripeLinks.basic;

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Redirecting to verified Stripe payment checkout...",
            url: redirectUrl
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            status: "SUCCESS", 
            url: "https://buy.stripe.com/3cI6oB7tA94M3gV68x5os06" 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
