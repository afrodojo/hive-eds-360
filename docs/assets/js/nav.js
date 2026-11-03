function renderHeader(activePage) {
    const headerHtml = `
    <header class="glass sticky top-0 z-50 border-b border-gray-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
            <a href="index.html" class="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white accent-glow hover:opacity-90 transition">
                DS
            </a>
            <div>
                <a href="index.html"><h1 class="text-lg font-bold text-white leading-none hover:text-indigo-300 transition">My Journey as a Doctoral Student</h1></a>
                <p class="text-xs text-indigo-400 font-mono mt-0.5">hive.eds-360.com | CS Ph.D. & Emerging Defense Solutions</p>
            </div>
        </div>

        <nav class="flex items-center gap-5 text-xs font-semibold">
            <a href="index.html" class="${activePage === 'home' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">Home</a>
            <a href="research.html" class="${activePage === 'research' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">Research Repos</a>
            <a href="RAG-console.html" class="${activePage === 'rag' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">RAG Terminal</a>
            <a href="blog.html" class="${activePage === 'blog' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">Blog & Dispatch</a>
            <a href="pricing.html" class="${activePage === 'pricing' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">Membership & Tiering</a>
            <a href="portal.html" class="${activePage === 'portal' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-300 hover:text-white'} pb-1 transition">Member Portal</a>
        </nav>
        
        <div class="flex items-center gap-3">
            <button onclick="triggerStripeCheckout('donation')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow accent-glow">
                <i class="fas fa-heart text-amber-300"></i> Donate
            </button>
            <div id="authStatusBadge" class="text-xs font-mono px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 flex items-center gap-1 cursor-pointer" onclick="window.location.href='portal.html'">
                <span class="w-2 h-2 rounded-full bg-red-500"></span> Public
            </div>
            <button id="authBtn" onclick="window.location.href='portal.html'" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition accent-glow">
                Log In
            </button>
        </div>
    </header>
    `;
    const container = document.getElementById('headerContainer');
    if (container) container.innerHTML = headerHtml;
}
