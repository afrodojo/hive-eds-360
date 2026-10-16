/**
 * FORENSIC RESEARCH WATERMARKING ENGINE
 * Enforces traceable cryptographic identity on document downloads/copies
 * Owner: Asaad Morman (Emerging Defense Solutions / Bowie State Univ)
 */
function generateForensicSignature(docId, userEmail) {
    const email = userEmail || localStorage.getItem('hive_user_email') || 'dassenseibsu@pm.me';
    const timestamp = new Date().toISOString();
    const sessionHash = btoa(`${email}|${docId}|${timestamp}|${navigator.userAgent}`).substring(0, 20);
    return {
        sigId: `EDS-PATENT-SIG-${sessionHash}`,
        timestamp: timestamp,
        userEmail: email
    };
}

function downloadWithWatermark(docTitle, docId) {
    const userEmail = localStorage.getItem('hive_user_email') || 'dassenseibsu@pm.me';
    const sig = generateForensicSignature(docId, userEmail);

    const watermarkedPayload = `================================================================================
FORENSIC WATERMARK NOTICE — PROPRIETARY RESEARCH ATTACHMENT
OWNER / DEVELOPER: ASAAD MORMAN (EMERGING DEFENSE SOLUTIONS / BOWIE STATE UNIV)
SIGNATURE ID: ${sig.sigId}
LICENSED TO: ${sig.userEmail}
TIMESTAMP: ${sig.timestamp}
================================================================================

TITLE: ${docTitle}
DOC ID: ${docId}

LEGAL WARNING:
This research document is watermarked and registered to ${sig.userEmail}. Any unauthorized
reproduction, sharing, or modification without written consent of Asaad Morman 
and Emerging Defense Solutions constitutes a breach of Acceptable Use Policy (AUP)
and will result in immediate civil liability and criminal prosecution under CFAA 18 U.S.C. § 1030.
`;

    const blob = new Blob([watermarkedPayload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docId}_Watermarked.txt`;
    a.click();

    // Log to Audit Log UI element if present
    const auditLog = document.getElementById('watermarkAuditLog');
    if (auditLog) {
        const logEntry = document.createElement('div');
        logEntry.className = "p-1.5 bg-slate-950 border border-purple-900/50 rounded text-purple-300";
        logEntry.innerHTML = `<span class="text-emerald-400 font-bold">[WATERMARK INJECTED]</span> ${sig.sigId} &mdash; Downloaded by ${sig.userEmail}`;
        auditLog.prepend(logEntry);
    }
}
