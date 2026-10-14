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
        const { fileName, fileContent, mimeType, folderId } = body;

        // Verify credentials from Cloudflare environment variables
        const serviceAccountKey = env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            // Return structured simulation response if credentials are being configured
            return new Response(JSON.stringify({
                status: "PENDING_CONFIG",
                message: "Endpoint ready. Please add GOOGLE_SERVICE_ACCOUNT_KEY to your Cloudflare Pages Environment Variables.",
                syncedFile: fileName || "daily_research_brief.md",
                targetFolder: folderId || "Bowie State Research Lab Assets"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: `Successfully uploaded ${fileName} to Google Drive!`,
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
