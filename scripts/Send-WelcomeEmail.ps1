param(
    [string]$RecipientEmail = "",
    [string]$UserName = "Community Member",
    [string]$SmtpServer = "smtp.gmail.com",
    [int]$SmtpPort = 587,
    [System.Management.Automation.PSCredential]$Credential = $null
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK AUTOMATED WELCOME & ONBOARDING ENGINE     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$logFile = "$env:USERPROFILE\hive-eds-360\trackers\welcome_email_log.json"
$trackersDir = Split-Path $logFile
if (-not (Test-Path $trackersDir)) { New-Item -ItemType Directory -Path $trackersDir -Force | Out-Null }

if ([string]::IsNullOrWhiteSpace($RecipientEmail)) {
    Write-Host "[INFO] No recipient specified. Scanning trackers for pending welcome dispatches..." -ForegroundColor Yellow
    exit 0
}

$bodyLines = @(
    "Hello $UserName,",
    "",
    "Welcome to the Hive Network! We are thrilled to have you join our data science and defense research community.",
    "",
    "Here are a few quick resources to help you get started:",
    "  - CS Ph.D. Dissertation & Research Logs: https://hive.eds-360.com/blog.html",
    "  - Dual-Use SBIR/STTR Partnerships: https://hive.eds-360.com/research.html",
    "  - Air-Gapped RAG Simulation Gateway: https://hive.eds-360.com/RAG-console.html",
    "",
    "If you have any questions or inquiries, feel free to reply directly to this email or contact us at dassenseibsu@pm.me.",
    "",
    "Best regards,",
    "The Hive Network Team"
)
$body = $bodyLines -join [Environment]::NewLine
$subject = "Welcome to the Hive Network Community!"

Write-Host "[DISPATCH] Preparing Welcome Email for $RecipientEmail..." -ForegroundColor Yellow

try {
    if ($null -ne $Credential) {
        Send-MailMessage -To $RecipientEmail -From "noreply@hive.eds-360.com" -Subject $subject -Body $body -SmtpServer $SmtpServer -Port $SmtpPort -UseSsl -Credential $Credential -ErrorAction Stop
        Write-Host "[SENT] Email dispatched via SMTP to $RecipientEmail" -ForegroundColor Green
    } else {
        Write-Host "[SIMULATION] Welcome email constructed for $RecipientEmail (Pass -Credential for live SMTP delivery)." -ForegroundColor Cyan
    }

    $logEntry = [PSCustomObject]@{
        email   = $RecipientEmail
        name    = $UserName
        sent_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        status  = if ($null -ne $Credential) { "DELIVERED" } else { "SIMULATED" }
    }
    $history = @()
    if (Test-Path $logFile) {
        $raw = Get-Content $logFile -Raw
        if (-not [string]::IsNullOrWhiteSpace($raw)) { $history = @($raw | ConvertFrom-Json) }
    }
    $history += $logEntry
    $history | ConvertTo-Json -Depth 4 | Set-Content -Path $logFile -Encoding UTF8
    Write-Host "[SUCCESS] Welcome record saved to trackers/welcome_email_log.json" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to process email: $($_.Exception.Message)" -ForegroundColor Red
}
