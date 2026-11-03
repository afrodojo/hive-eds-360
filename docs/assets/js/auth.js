let userSession = { 
    authenticated: false, 
    emailVerified: false, 
    onboarded: false,
    role: 'visitor', 
    email: '', 
    fullName: '',
    organization: '',
    bio: '',
    verificationToken: '' 
};

function updateAuthUI() {
    const badge = document.getElementById('authStatusBadge');
    const authBtn = document.getElementById('authBtn');
    if (!badge || !authBtn) return;

    if (userSession.authenticated) {
        const displayName = userSession.fullName || userSession.email;
        if (userSession.emailVerified) {
            badge.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 cursor-pointer hover:bg-emerald-900';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ${displayName}`;
            badge.onclick = () => window.location.href = 'portal.html';
        } else {
            badge.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1 cursor-pointer';
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pending Email Verification`;
        }
        authBtn.innerText = 'Log Out';
        authBtn.onclick = processLogout;
    } else {
        badge.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 flex items-center gap-1';
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500"></span> Public`;
        badge.onclick = null;
        authBtn.innerText = 'Log In / Sign Up';
        authBtn.onclick = () => window.location.href = 'portal.html';
    }
}

function processLogout() {
    userSession = { authenticated: false, emailVerified: false, role: 'visitor', email: '', verificationToken: '' };
    localStorage.removeItem('hive_user_session');
    updateAuthUI();
    window.location.href = 'index.html';
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('hive_user_session');
    if (saved) {
        userSession = JSON.parse(saved);
        updateAuthUI();
    }
});
