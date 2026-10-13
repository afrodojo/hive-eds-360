export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Endpoint route: /api/webhook
    if (url.pathname === "/api/webhook" && request.method === "POST") {
      try {
        const payload = await request.json();

        // Extract commit details from GitHub Push payload
        const commitData = {
          sha: payload.after ? payload.after.substring(0, 7) : "0000000",
          author: payload.pusher ? payload.pusher.name : "DevSecOps CI/CD",
          message: payload.head_commit ? payload.head_commit.message : "System Update",
          timestamp: new Date().toISOString(),
          repo: payload.repository ? payload.repository.full_name : "afrodojo/hive-eds-360"
        };

        // Option A: Store in Cloudflare KV / D1 / Cache for portal fetching
        if (env.HIVE_KV) {
          await env.HIVE_KV.put("latest_git_telemetry", JSON.stringify(commitData));
        }

        return new Response(JSON.stringify({ 
          status: "SUCCESS", 
          message: "Telemetry ingested into EDS-360 Enclave",
          commit: commitData.sha 
        }), {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON Payload", details: err.message }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Default static assets pass-through for Pages
    return env.ASSETS.fetch(request);
  }
};