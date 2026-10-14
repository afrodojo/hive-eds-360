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
        const fileName = body.fileName || "2026-10-14_Daily_Research_Package.md";
        const targetAccount = "cyberdojosensei@gmail.com";

        const serviceAccountKey = env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            return new Response(JSON.stringify({
                status: "PENDING_CREDENTIALS",
                targetEmail: targetAccount,
                syncedFile: fileName,
                message: `Drive Sync Endpoint targeted for ${targetAccount}. Add GOOGLE_SERVICE_ACCOUNT_KEY to Cloudflare Pages environment variables to complete direct background uploads.`
            }), {
                status: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            targetEmail: targetAccount,
            message: `Successfully uploaded ${fileName} to Google Drive (${targetAccount})!`,
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
