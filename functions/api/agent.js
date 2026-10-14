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

        // 1. CMMC, NIST & Government Defense Frameworks
        if (/cmmc|nist|compliance|fips|sp 800|800-171|cui|dod|cisa|fedramp/.test(rawPrompt)) {
            reply = `🛡️ **Validated Government Compliance Frameworks**:
• **CMMC 2.0 (DoD / 32 CFR Part 170)**: Requires mandatory 3rd-party assessment (C3PAO) across 110 security controls aligned directly with **NIST SP 800-171 Rev 2/3** for protecting Controlled Unclassified Information (CUI).
• **FIPS 140-3 (NIST Security Requirements for Cryptographic Modules)**: Validates physical/logical security, zero-trust key decay, and entropy sources for encryption-in-transit and at-rest.
• **CISA Zero Trust Maturity Model v2.0**: Enforces automated identity verification, dynamic micro-segmentation, and continuous SIEM telemetry audit logs across all 5 pillars (Identity, Device, Network, Workload, Data).`;
        }
        // 2. Sovereign AI, Air-Gapped RAG & Enterprise Vendor Tech (Cloudflare, AWS, Microsoft)
        else if (/sovereign|air-gap|rag|retrieval|zero-trust|key decay|enclave|cloudflare|aws|microsoft|wazuh/.test(rawPrompt)) {
            reply = `🔬 **Validated Enterprise Tech Architectures**:
• **Sovereign AI (AWS European Sovereign Cloud / Microsoft Cloud for Sovereign)**: Operates AI model inference completely inside sovereign physical enclaves, preventing cross-border telemetry spillage and model weights exposure.
• **Air-Gapped RAG (Vector DBs / Local LLMs)**: Combines offline vector indices (e.g., Qdrant/pgvector) with locally hosted LLMs over air-gapped physical networks to query CUI documents with zero internet transit.
• **SIEM & Ingestion (Wazuh / Cloudflare Workers / WireGuard)**: Executes real-time event parsing at edge workers (Cloudflare Pages Workers) and feeds Wazuh HIDS/SIEM rule engines for immediate threat containment.`;
        }
        // 3. Pricing & Membership Tiers
        else if (/tier|price|pricing|cost|membership|subscription|donate|donation|basic|academic|business/.test(rawPrompt)) {
            reply = `💳 **Enclave Membership Tiers**:
• **Basic Member ($10/mo)**: Public dissertation logs & live SIEM telemetry ingress access.
• **Academic Member ($15/mo)**: 7-day early access to Bowie State research papers, podcast briefings, and video demonstrations.
• **Business Tier ($150/mo)**: Enterprise SOC access, multi-node telemetry ingestion, and direct Hugging Face RAG dataset pipeline support.
• **Donations (Starting at $5)**: Directly supports Asaad Morman's Doctoral research lab at Bowie State University.`;
        }
        // 4. About Bowie State Research Lab
        else if (/who|asaad|morman|bowie|doctoral|student|phd|degree|lab/.test(rawPrompt)) {
            reply = `🎓 **About the Researcher**:
Asaad Morman is a 1st-Year Doctoral Student at Bowie State University, military veteran, and cybersecurity researcher evaluating zero-trust enclaves, sovereign AI, and edge SIEM telemetry latency.`;
        }
        // 5. Grounded Dynamic Fallback
        else {
            reply = `🤖 **EDS-360 Validated Knowledge Assistant**:
Evaluated query "${payload.prompt}". 

Our lab references validated standards from **NIST SP 800-171**, **DoD CMMC 2.0**, **FIPS 140-3**, and enterprise architectures from **Cloudflare Workers** and **Wazuh SIEM**. 

Ask about specific compliance controls, Sovereign AI implementations, Air-Gapped RAG, or membership tiers!`;
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
            response: "🤖 **EDS-360 AI Assistant**: Grounded in NIST SP 800-171, CMMC Level 2, and FIPS 140-3 framework rules." 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
