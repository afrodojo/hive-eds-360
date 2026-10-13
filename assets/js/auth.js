// The Hive Network - Authentication & Super-Admin Management Engine

const SUPER_ADMINS = ["dassensebsu@pm.me", "asaad.morman@eds-360.com"];

function getCurrentUser() {
    const userJson = localStorage.getItem("hive_user");
    if (!userJson) return null;
    return JSON.parse(userJson);
}

function setCurrentUser(email, tier = "business") {
    const isSuperAdmin = SUPER_ADMINS.includes(email.toLowerCase().trim());
    const user = {
        email: email.toLowerCase().trim(),
        tier: isSuperAdmin ? "super_admin" : tier,
        isSuperAdmin: isSuperAdmin,
        permissions: isSuperAdmin 
            ? ["read", "write", "publish", "delete", "moderate", "embed_media", "admin_access"]
            : ["read"]
    };
    localStorage.setItem("hive_user", JSON.stringify(user));
    return user;
}

// Auto-initialize dassensebsu@pm.me as active super-admin session if no user exists
if (!localStorage.getItem("hive_user")) {
    setCurrentUser("dassensebsu@pm.me", "super_admin");
}

function checkAdminPermission() {
    const user = getCurrentUser();
    return user && user.isSuperAdmin;
}

// Utility to parse Facebook, YouTube, and generic media URLs into responsive embeds
function generateMediaEmbed(url) {
    if (!url) return '';
    
    // Facebook Post or Video URL Parsing
    if (url.includes("facebook.com")) {
        const encodedUrl = encodeURIComponent(url);
        return `<div class="aspect-video w-full rounded-xl overflow-hidden my-4 border border-gray-800">
            <iframe src="https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500" class="w-full h-full border-none" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
        </div>`;
    }
    
    // YouTube Video Link Parsing
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = url.split("v=")[1] || url.split("/").pop();
        if (videoId.includes("&")) videoId = videoId.split("&")[0];
        return `<div class="aspect-video w-full rounded-xl overflow-hidden my-4 border border-gray-800">
            <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
    }
    
    return `<div class="p-3 bg-gray-950 border border-gray-800 rounded-lg my-2 text-xs text-blue-400 font-mono"><a href="${url}" target="_blank" rel="noopener">🔗 External Media Link: ${url}</a></div>`;
}
