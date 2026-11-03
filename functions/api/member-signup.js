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
        const memberName = body.name || "Anonymous Researcher";
        const email = body.email || "cyberdojosensei@gmail.com";
        const tier = body.tier || "Academic ($150/mo)";
        const notes = body.notes || "Inquiry regarding Bowie State zero-trust research enclave access.";

        const manifestContent = `# New Member Inquiry & Tier Application\n\n- Name: ${memberName}\n- Email: ${email}\n- Requested Tier:${tier}\n- Application Notes: ${notes}\n- Submitted:${new Date().toISOString()}`;

        const clientId = env.GDRIVE_CLIENT_ID;
        const clientSecret = env.GDRIVE_CLIENT_SECRET;
        const refreshToken = env.GDRIVE_REFRESH_TOKEN;
        const folderId = "1oMBRGMBAW_SeD69tLj_93y50qfEG4jko";

        if (clientId && clientSecret && refreshToken) {
            const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: refreshToken,
                    grant_type: "refresh_token"
                })
            });
            const tokenData = await tokenResp.json();

            if (tokenData.access_token) {
                const metadata = { name: `Member_App_${memberName.replace(/\s+/g, '_')}_${Date.now()}.md`, parents: [folderId], mimeType: "text/markdown" };
                const form = new FormData();
                form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
                form.append("file", new Blob([manifestContent], { type: "text/markdown" }));

                await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
                    body: form
                });
            }
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: `Thank you ${memberName}. Your application for ${tier} has been recorded and routed to the admin inbox!`,
            tier: tier
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
