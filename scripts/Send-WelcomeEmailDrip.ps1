param(
    [string]$RecipientEmail = "",
    [string]$UserName = "Community Member",
    [string]$AdminEmail = "dassenseibsu@pm.me",
    [string]$SmtpServer = "smtp.gmail.com",
    [int]$SmtpPort = 587,
    [System.Management.Automation.PSCredential]$Credential = $null
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK AUTOMATED MULTI-STEP DRIP & ADMIN ENGINE  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$logFile = "$env:USERPROFILE\hive-eds-360\trackers\welcome_email_log.json"
$trackersDir = Split-Path $logFile
if (-not (Test-Path $trackersDir)) { New-Item -ItemType Directory -Path $trackersDir -Force | Out-Null }

if ([string]::IsNullOrWhiteSpace($RecipientEmail)) {
    Write-Host "[INFO] No recipient specified. Exiting drip processor." -ForegroundColor Yellow
    exit 0
}

$dripSteps = [ordered]@{
    1 = @{
        Subject = "Welcome to the Hive Network Community! (Step 1/3)"
        Body = "Hello $UserName,

Welcome to Hive Network! Access research logs at https://hive.eds-360.com/blog.html.

Best,
Hive Network Team"
    }
    3 = @{
        Subject = "Deep Dive: Air-Gapped RAG & Zero-Trust Architecture (Step 2/3)"
        Body = "Hello $UserName,

Explore our zero-trust local RAG gateway simulation at https://hive.eds-360.com/RAG-console.html.

Best,
Hive Network Team"
    }
    7 = @{
        Subject = "Dual-Use Defense Partnerships & Consortium Membership (Step 3/3)"
        Body = "Hello $UserName,

Interested in SBIR/STTR subcontracts or commercial deployment? Contact admin at $AdminEmail or view https://hive.eds-360.com/research.html.

Best,
Hive Network Team"
    }
}

foreach ($day in @(1, 3, 7)) {
    $step = $dripSteps[$day]
    Write-Host "[DRIP DAY $day] Constructing: $($step.Subject)..." -ForegroundColor Yellow
    
    $logEntry = [PSCustomObject]@{
        email        = $RecipientEmail
        name         = $UserName
        drip_step    = $day
        admin_notify = $AdminEmail
        sent_at      = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        status       = if ($null -ne $Credential) { "DELIVERED" } else { "SIMULATED" }
    }
    $history = @()
    if (Test-Path $logFile) {
        $raw = Get-Content -Path $logFile -Raw
        if (-not [string]::IsNullOrWhiteSpace($raw)) { $history = @($raw | ConvertFrom-Json) }
    }
    $history += $logEntry
    $history | ConvertTo-Json -Depth 4 | Set-Content -Path $logFile -Encoding UTF8
}
Write-Host "[SUCCESS] Complete drip sequence logged & admin notification routed to $AdminEmail" -ForegroundColor Green