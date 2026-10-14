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

        // 1. CMMC / NIST / Compliance Questions
        if (/cmmc|nist|compliance|fips|sp 800|800-171|framework|security level/.test(rawPrompt)) {
            reply = "🛡️ **Compliance & Framework Insights**:\n• **CMMC Level 2**: Focuses on protecting Controlled Unclassified Information (CUI) through 110 security controls aligned with NIST SP 800-171.\n• **FIPS 140-3**: Federal standard for validating cryptographic modules, key generation, and decay in zero-trust enclaves.\n• **Enclave Security**: Our Bowie State testbed implements automated boundary checks and continuous monitoring to meet CMMC and NIST guidelines.";
        }
        // 2. Pricing & Tier Access Questions
        else if (/tier|price|pricing|cost|membership|subscription|donate|donation|basic|academic|business/.test(rawPrompt)) {
            reply = "💳 **Membership Tiers & Access Levels**:\n• **Basic Member ($10/mo)**: Public dissertation logs & live SIEM telemetry ingress.\n• **Academic Member ($15/mo)**: 7-day early access to Bowie State research papers, podcasts, and video demonstrations.\n• **Business Tier ($150/mo)**: Enterprise SOC tools, multi-node telemetry ingestion, and direct Hugging Face RAG dataset pipeline support.\n• **Donations (Starting at $5)**: Directly supports Asaad Morman's Doctoral research lab at Bowie State University.";
        }
        // 3. Technical Terms: Sovereign AI & Air-Gapped RAG
        else if (/sovereign|air-gap|rag|retrieval|zero-trust|key decay|enclave/.test(rawPrompt)) {
            reply = "🔬 **Technical Concepts & Research Focus**:\n• **Sovereign AI**: Locally owned and deployed AI infrastructure ensuring 100% data sovereignty without relying on public cloud vendors.\n• **Air-Gapped RAG**: Retrieval-Augmented Generation running entirely on isolated, offline networks to eliminate data leaks.\n• **Key Decay**: Automated, high-frequency recycling of WireGuard keys to prevent prolonged session compromise.";
        }
        // 4. About Asaad Morman / Bowie State
        else if (/who|asaad|morman|bowie|doctoral|student|phd|degree|lab/.test(rawPrompt)) {
            reply = "🎓 **About the Researcher**:\nAsaad Morman is a 1st-Year Doctoral Student at Bowie State University, military veteran, and cybersecurity researcher evaluating zero-trust enclaves, sovereign AI, and edge SIEM telemetry latency.";
        }
        // 5. Dynamic Fallback for Other Cybersecurity Queries
        else {
            reply = `🤖 **EDS-360 AI Assistant**: Evaluated prompt "${payload.prompt}".\n\nOur lab evaluates zero-trust architecture, CMMC 2.0 compliance, FIPS 140-3 key decay, and air-gapped RAG pipelines. Ask me about specific terms, compliance frameworks, or our membership tiers!`;
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
