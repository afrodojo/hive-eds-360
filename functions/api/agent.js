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
        const q = (payload.prompt || "").toLowerCase().trim();
        let reply = "";

        if (q.includes("quantum") || q.includes("pqc") || q.includes("lattice") || q.includes("kyber") || q.includes("dilithium")) {
            reply = `⚛️ **Quantum Resilience & Post-Quantum Cryptography (PQC)**:
• **Quantum Threat**: Shor's algorithm renders classical RSA/ECC obsolete, while Grover's algorithm halves symmetric key strength.
• **PQC Transition**: Enforces NIST FIPS 203 (ML-KEM) for key exchange and FIPS 204 (ML-DSA) for digital signatures inside Bowie State enclaves.
• **Impact on RAG**: Air-Gapped RAG mitigates Harvest-Now-Decrypt-Later (HNDL) attacks by keeping vector embeddings isolated, though PQC ciphertext size increases edge processing latency.`;
        } else if (q.includes("cmmc") || q.includes("nist") || q.includes("compliance")) {
            reply = `🛡️ **CMMC 2.0 & NIST SP 800-171 Compliance**:
• Aligns 110 security controls across 14 families to protect Controlled Unclassified Information (CUI).
• Mandates FIPS 140-3 validated cryptographic modules and continuous SIEM telemetry audit trails.`;
        } else if (q.includes("rag") || q.includes("sovereign") || q.includes("air gap")) {
            reply = `🔬 **Sovereign AI & Air-Gapped RAG**:
• Operates local model inference over offline vector stores (Qdrant/pgvector) with zero internet transport.
• Grounded via Hugging Face repository (\`afrodojo/cyberdojosensei\`) to eliminate AI hallucinations and cloud data spillage.`;
        } else if (q.includes("graduat") || q.includes("year") || q.includes("timeline")) {
            reply = `🎓 **Doctoral Timeline**:
• Asaad Morman started his Doctor of Applied Science (DAS) in Computer Science at Bowie State University in 2026.
• Targeted completion is **2029 - 2030**, following dissertation defense and FIPS/PQC testbed validation.`;
        } else {
            reply = `🤖 **EDS-360 AI Assistant**: Evaluated prompt "${payload.prompt}". Ask about Quantum Resilience, Post-Quantum Cryptography (PQC), CMMC Level 2, or Air-Gapped RAG tradeoffs!`;
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
        return new Response(JSON.stringify({ status: "SUCCESS", response: "Active under Bowie State Black & Gold Enclave rules." }), { status: 200 });
    }
}
