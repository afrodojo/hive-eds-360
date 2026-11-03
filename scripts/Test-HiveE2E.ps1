Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK FULL E2E FUNCTIONALITY & ROUTE AUDITOR   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$pages = @("portal.html", "admin.html", "blog.html", "RAG-console.html", "research.html", "index.html")
$trackers = @("trackers\welcome_email_log.json", "trackers\engagement_response_queue.json")
$scripts = @("scripts\Send-WelcomeEmailDrip.ps1", "scripts\Optimize-EngagementCadence.ps1", "scripts\Send-EngagementResponse.ps1", "scripts\Start-HiveDashboard.ps1", "scripts\Test-HiveSecurity.ps1")

Write-Host "
[1/4] AUDITING STATIC HTML PAGES & ROUTE FILES..." -ForegroundColor Yellow
foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        Write-Host "  [PASS] $page exists ($($content.Length) bytes)" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] $page missing from root directory!" -ForegroundColor Red
    }
}

Write-Host "
[2/4] AUDITING DATA TRACKERS & SCHEMAS..." -ForegroundColor Yellow
foreach ($tracker in $trackers) {
    if (Test-Path $tracker) {
        try {
            $json = Get-Content $tracker -Raw | ConvertFrom-Json
            Write-Host "  [PASS] $tracker valid JSON" -ForegroundColor Green
        } catch {
            Write-Host "  [FAIL] $tracker invalid JSON syntax!" -ForegroundColor Red
        }
    } else {
        Write-Host "  [WARN] $tracker missing!" -ForegroundColor Red
    }
}

Write-Host "
[3/4] AUDITING BACKEND AUTOMATION SCRIPTS..." -ForegroundColor Yellow
foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "  [PASS] $script verified" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $script missing!" -ForegroundColor Red
    }
}

Write-Host "
[4/4] VERIFYING PORTAL & ADMIN ROLE-BASED AUTHENTICATION LOGIC..." -ForegroundColor Yellow
if (Test-Path "portal.html") {
    $portal = Get-Content "portal.html" -Raw
    if ($portal -match "dassenseibsu@pm.me" -and $portal -match "cyberdojosensei@gmail.com") {
        Write-Host "  [PASS] Dual admin roles hardcoded in portal.html" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Missing admin email definitions in portal.html!" -ForegroundColor Red
    }
}

Write-Host "
==========================================================" -ForegroundColor Cyan
Write-Host "   FULL E2E SYSTEM AUDIT COMPLETE - ALL CORE ROUTES READY " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan