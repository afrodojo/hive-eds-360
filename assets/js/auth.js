// Security & Authentication Controller - Hive EDS-360
function getCurrentUser() {
    let u = localStorage.getItem("hive_user");
    if (!u) {
        u = JSON.stringify({ email: "das.student@eds-360.com", role: "Executive Admin", domain: "eds-360.com" });
        localStorage.setItem("hive_user", u);
    }
    return JSON.parse(u);
}

function switchPortalMode(mode) {
    const memberView = document.getElementById("viewMemberHub");
    const adminView = document.getElementById("viewAdminEnclave");
    const btnMember = document.getElementById("modeBtnMember");
    const btnAdmin = document.getElementById("modeBtnAdmin");

    if (!memberView || !adminView) return;

    if (mode === "admin") {
        memberView.classList.add("hidden");
        adminView.classList.remove("hidden");
        
        btnAdmin.className = "px-3 py-1.5 rounded-lg text-purple-400 bg-gray-800 border border-purple-500/30";
        btnMember.className = "px-3 py-1.5 rounded-lg text-gray-400 hover:text-white";
        
        // Ensure default tab is rendered
        if (typeof renderCollaborativeLab === 'function') renderCollaborativeLab();
    } else {
        adminView.classList.add("hidden");
        memberView.classList.remove("hidden");
        
        btnMember.className = "px-3 py-1.5 rounded-lg text-purple-400 bg-gray-800 border border-purple-500/30";
        btnAdmin.className = "px-3 py-1.5 rounded-lg text-gray-400 hover:text-white";
    }
}
