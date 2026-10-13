export async function onRequestPost(context) {
    try {
        const payload = await context.request.json();
        const eventType = context.request.headers.get("X-GitHub-Event") || "push";

        const commitData = {
            event: eventType,
            sha: payload.after ? payload.after.substring(0, 7) : (payload.head_commit ? payload.head_commit.id.substring(0, 7) : "0000000"),
            author: payload.pusher ? payload.pusher.name : (payload.sender ? payload.sender.login : "DevSecOps CI/CD"),
            message: payload.head_commit ? payload.head_commit.message : `GitHub Event: ${eventType}`,
            timestamp: new Date().toISOString(),
            repo: payload.repository ? payload.repository.full_name : "afrodojo/hive-eds-360"
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Telemetry ingested into EDS-360 Enclave",
            data: commitData
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-GitHub-Event"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ status: "ACK", message: "Webhook ping or payload received", error: err.message }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-GitHub-Event"
        }
    });
}
