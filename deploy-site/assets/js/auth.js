// Security & Authentication Controller - Hive EDS-360
function getCurrentUser() {
    let u = localStorage.getItem("hive_user");
    if (!u) {
        u = JSON.stringify({ email: "das.student@eds-360.com", role: "Executive Admin", domain: "eds-360.com" });
        localStorage.setItem("hive_user", u);
    }
    return JSON.parse(u);
}

// Global Data Stores
let registeredModels = JSON.parse(localStorage.getItem("hive_collaborative_models") || "[]");
let registeredCustomMachines = JSON.parse(localStorage.getItem("hive_custom_machines") || "[]");
let registeredScripts = JSON.parse(localStorage.getItem("hive_uploaded_scripts") || "[]");
let registeredExternalRepos = JSON.parse(localStorage.getItem("hive_external_repos") || "[]");
let partnerSimulatedSystems = JSON.parse(localStorage.getItem("hive_partner_systems") || "[]");

// Seed Baseline Models
if (registeredModels.length === 0) {
    registeredModels = [
        { id: "MOD-001", name: "Qwen2.5-Coder-7B-Instruct", framework: "vLLM", quantization: "AWQ INT4", vram_gb: 5.8, status: "Active Primary" },
        { id: "MOD-002", name: "DeepSeek-R1-Distill-Qwen-14B", framework: "vLLM", quantization: "FP8", vram_gb: 14.2, status: "Standby" },
        { id: "MOD-003", name: "Llama-3.1-70B-Instruct", framework: "vLLM Cluster", quantization: "GGUF Q4_K_M", vram_gb: 42.0, status: "Standby" }
    ];
    localStorage.setItem("hive_collaborative_models", JSON.stringify(registeredModels));
}

// Seed Baseline Hardware Machines
if (registeredCustomMachines.length === 0) {
    registeredCustomMachines = [
        { id: "MACH-01", name: "Node 2 (vLLM CUDA Cluster)", ip_address: "10.0.20.102", gpu_spec: "4x NVIDIA A100-SXM4-80GB", added_by: "system" },
        { id: "MACH-02", name: "Tactical Edge Workstation 01", ip_address: "10.0.20.120", gpu_spec: "2x RTX 4090 / Apple M3 Max", added_by: "das.student@eds-360.com" }
    ];
    localStorage.setItem("hive_custom_machines", JSON.stringify(registeredCustomMachines));
}

// Seed Geopolitical Routes
const GLOBAL_TELEMETRY_ROUTES = [
    { id: "RT-7091", origin: "United States (US-EAST)", ip: "198.51.100.42", target: "Node 1 (10.0.20.101)", geo: "38.8951° N, 77.0364° W", protocol: "WireGuard UDP/51820", threat: "Nominal", score_impact: 0, flag: "🇺🇸" },
    { id: "RT-8842", origin: "Germany (DE-BER)", ip: "185.220.101.5", target: "Node 1 (10.0.20.101)", geo: "52.5200° N, 13.4050° E", protocol: "TLS 1.3 / Port 443", threat: "Nominal", score_impact: 2, flag: "🇩🇪" },
    { id: "RT-3019", origin: "China (CN-SHA)", ip: "114.247.50.2", target: "Node 2 (10.0.20.102)", geo: "31.2304° N, 121.4737° E", protocol: "SSH Scan / Port 22", threat: "High Risk", score_impact: 28, flag: "🇨🇳" },
    { id: "RT-9921", origin: "Russian Fed (RU-MOW)", ip: "194.226.29.11", target: "Node 3 (10.0.20.103)", geo: "55.7558° N, 37.6173° E", protocol: "Unauthorized API Probe", threat: "High Risk", score_impact: 35, flag: "🇷🇺" },
    { id: "RT-4102", origin: "Iran (IR-THR)", ip: "5.160.22.1", target: "Node 4 (10.0.20.104)", geo: "35.6892° N, 51.3890° E", protocol: "Kerberos TGT Probe", threat: "Suspicious", score_impact: 18, flag: "🇮🇷" }
];

function getRegisteredModels() { return registeredModels; }
function getCustomMachines() { return registeredCustomMachines; }
function getRegisteredScripts() { return registeredScripts; }
function getExternalRepos() { return registeredExternalRepos; }
function getPartnerSimulatedSystems() { return partnerSimulatedSystems; }
function getGlobalRoutes() { return GLOBAL_TELEMETRY_ROUTES; }

function switchPortalMode(mode) {
    const memberView = document.getElementById("viewMemberHub");
    const adminView = document.getElementById("viewAdminEnclave");
    const btnMember = document.getElementById("modeBtnMember");
    const btnAdmin = document.getElementById("modeBtnAdmin");

    if (!memberView || !adminView) return;

    if (mode === "admin") {
        memberView.classList.add("hidden");
        adminView.classList.remove("hidden");
        btnAdmin.className = "px-3 py-1.5 rounded-lg text-purple-400 bg-gray-800 border border-purple-500/30 font-bold";
        btnMember.className = "px-3 py-1.5 rounded-lg text-gray-400 hover:text-white";
        if (typeof switchAdminTab === 'function') switchAdminTab('collab');
    } else {
        adminView.classList.add("hidden");
        memberView.classList.remove("hidden");
        btnMember.className = "px-3 py-1.5 rounded-lg text-purple-400 bg-gray-800 border border-purple-500/30 font-bold";
        btnAdmin.className = "px-3 py-1.5 rounded-lg text-gray-400 hover:text-white";
    }
}

// GitHub REST API Integration Engine
async function fetchGitHubRepoTelemetry(repoOwner = "afrodojo", repoName = "hive-eds-360") {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=5`);
        if (!response.ok) throw new Error("GitHub API rate limit or invalid endpoint");
        const commits = await response.json();
        
        const gitHubEvents = commits.map(c => ({
            id: c.sha.substring(0, 7),
            author: c.commit.author.name,
            message: c.commit.message,
            date: c.commit.author.date,
            url: c.html_url
        }));

        localStorage.setItem("hive_github_live_commits", JSON.stringify(gitHubEvents));
        logBOEEvent("GITHUB_SYNC_SUCCESS", `Synced ${gitHubEvents.length} live commits from ${repoOwner}/${repoName}`);
        return gitHubEvents;
    } catch (err) {
        console.warn("GitHub API Fetch Warning:", err.message);
        return JSON.parse(localStorage.getItem("hive_github_live_commits") || "[]");
    }
}

function renderGitHubCommitsOnDashboard() {
    const commits = JSON.parse(localStorage.getItem("hive_github_live_commits") || "[]");
    const container = document.getElementById("repoRegistryList");
    if (!container) return;

    if (commits.length === 0) {
        container.innerHTML = "<p class='text-gray-500 font-mono text-xs p-2'>Click 'Sync GitHub API' to fetch live repository commit activity.</p>";
        return;
    }

    container.innerHTML = commits.map(c => `
        <div class="p-2.5 bg-gray-950 border border-amber-900/40 rounded-xl font-mono text-xs flex justify-between items-center">
            <div class="truncate max-w-md">
                <strong class="text-amber-300 block truncate">📌 Commit [${c.id}]: ${c.message}</strong>
                <span class="text-[10px] text-gray-400">By ${c.author} • ${new Date(c.date).toLocaleTimeString()}</span>
            </div>
            <a href="${c.url}" target="_blank" class="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-1 rounded font-bold hover:bg-amber-900">View on GitHub ↗</a>
        </div>
    `).join('');
}
