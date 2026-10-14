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

        if (/tier|price|pricing|cost|membership|subscription|donation|basic|academic|business/.test(rawPrompt)) {
            reply = "💳 **Membership Tiers & Pricing**:\n• **Basic Member ($10/mo)**: Standard access to public research logs & live SIEM telemetry ingress.\n• **Academic Member ($15/mo)**: Full 7-day early access to Bowie State research papers, podcast briefs, and video demonstrations.\n• **Business Tier ($150/mo)**: Enterprise SOC access, multi-node telemetry ingestion, and direct Hugging Face RAG dataset pipeline support.\n• **Donations (Starting at $5)**: Directly supports Asaad Morman's Doctoral research lab at Bowie State University.";
        } else if (/sovereign|air-gap|rag|fips|cmmc|nist|zero-trust|key decay/.test(rawPrompt)) {
            reply = "🛡️ **Terminology & Technical Definitions**:\n• **Sovereign AI**: Locally hosted AI infrastructure ensuring 100% data ownership under strict enclave boundaries.\n• **Air-Gapped RAG**: Retrieval-Augmented Generation operating on offline, isolated hardware with zero cloud leaks.\n• **FIPS 140-3 & CMMC**: Federal cryptographic standards and defense cybersecurity maturity compliance rules.\n• **Key Decay**: Automated continuous rotation of WireGuard zero-trust peer keys.";
        } else if (/threat|scenario|attack|siem|insight|bruteforce/.test(rawPrompt)) {
            reply = "🚨 **Threat Simulation Engine**:\n• Alert ID: [INSIGHT-688]\n• Vector: SSH Bruteforce Attempt from 185.220.101.5\n• Mitigation: Automated Wazuh Rule #100210 triggered. Peer isolated under FIPS 140-3 rules.";
        } else if (/who|asaad|bowie|doctoral|phd|degree/.test(rawPrompt)) {
            reply = "🎓 **About Asaad Morman**:\nAsaad Morman is a 1st-Year Doctoral Student at Bowie State University, military veteran, and cybersecurity expert developing zero-trust enclaves and sovereign AI research.";
        } else {
            reply = `🤖 **EDS-360 AI Assistant**: Evaluated prompt "${payload.prompt}". Ask about our membership tiers ($10 Basic, $15 Academic, $150 Business, $5+ Donations) or technical terms like Sovereign AI & Air-Gapped RAG!`;
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
            response: "🤖 **EDS-360 AI Assistant**: Active under Bowie State Black & Gold Enclave rules." 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
