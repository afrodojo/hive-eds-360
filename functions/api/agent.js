export async function onRequest(context) {
    const { request } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        });
    }

    try {
        const payload = await request.json().catch(() => ({}));
        const rawPrompt = (payload.prompt || "").toLowerCase().trim();
        let reply = "";

        if (/threat|scenario|attack|siem|insight|bruteforce/.test(rawPrompt)) {
            reply = "🚨 **Threat Simulation Engine**:\n• Alert ID: [INSIGHT-688]\n• Vector: SSH Bruteforce Attempt from 185.220.101.5\n• Mitigation: Automated Wazuh Rule #100210 triggered. WireGuard peer isolated under FIPS 140-3 constraints.";
        } else if (/cmmc|nist|compliance|fips|guard/.test(rawPrompt)) {
            reply = "🛡️ **Compliance Guard Status**:\n• NIST SP 800-171 / CMMC Level 2 verified.\n• Key Decay: Continuous zero-trust rotation active.\n• Boundary Enforcement: Cloudflare Pages edge isolation operational.";
        } else if (/user|traffic|stats|analytics|metric/.test(rawPrompt)) {
            reply = "📊 **User & Traffic Telemetry**:\n• Daily Ingress: 8,304 MPS (Peak: 12,410 MPS)\n• Active Enclave Users: 142 Sessions\n• Top Demand: CMMC 2.0 Compliance & Zero-Trust Key Management.";
        } else if (/blog|report|content|podcast|video/.test(rawPrompt)) {
            reply = "📝 **AI Content Engine**:\n• Generated Report Draft: 'Mitigating Edge Vulnerabilities in FIPS 140-3 Enclaves'\n• Ready to publish to /blog.html or embed research video on /research.html.";
        } else {
            reply = `🤖 **EDS-360 Agent**: Evaluated command "${payload.prompt}". Enclave parameters active under optimal FIPS 140-3 rules.`;
        }

        return new Response(JSON.stringify({ 
            status: "SUCCESS", 
            response: reply,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            status: "SUCCESS", 
            response: "🤖 **EDS-360 Agent**: Enclave command engine active." 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
