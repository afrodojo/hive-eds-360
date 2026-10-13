// The Hive Network - Enterprise Domain Governance & CUI Access Engine

const CUI_AUTHORIZED_DOMAINS = ["eds-360.com", "emergingdefensesolutions.com"];
const RESEARCH_SUPER_ADMINS = ["dassensebsu@pm.me", "asaad.morman@eds-360.com"];

function getCurrentUser() {
    const userJson = localStorage.getItem("hive_user");
    if (!userJson) return null;
    return JSON.parse(userJson);
}

function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/(<script|javascript:|data:|vbscript:)/gi, '[BLOCKED_INJECTION]');
}

// Strictly verifies if user belongs to @eds-360.com or @emergingdefensesolutions.com
function checkCUIEnclaveClearance() {
    const user = getCurrentUser();
    if (!user || !user.email) return false;
    
    const domain = user.email.split('@')[1]?.toLowerCase().trim();
    return CUI_AUTHORIZED_DOMAINS.includes(domain);
}

// Logic gate verification requiring both domain clearance and session key
function validateCUIGate(passphrase) {
    if (!checkCUIEnclaveClearance()) {
        return { allowed: false, reason: "CUI Enclaves restricted to @eds-360.com or @emergingdefensesolutions.com domain addresses only." };
    }
    if (passphrase !== "EDS-360-CMMC2-CLEARANCE") {
        return { allowed: false, reason: "Invalid CUI session clearance key." };
    }
    return { allowed: true };
}

function checkResearchAdminPermission() {
    const user = getCurrentUser();
    if (!user) return false;
    return RESEARCH_SUPER_ADMINS.includes(user.email.toLowerCase().trim()) || checkCUIEnclaveClearance();
}
