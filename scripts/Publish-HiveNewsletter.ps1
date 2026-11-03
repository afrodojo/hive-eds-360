param(
    [string]$TemplateName = "newsletter_default.html",
    [string]$Subject = "Early Access Dispatch: Sovereign AI Updates",
    [string]$BodyContent = "Exclusive 48-hour early preview of our latest RAG benchmarks for paid members.",
    [string]$ActionText = "Access Member Portal",
    [string]$ActionUrl = "https://hive.eds-360.com/portal.html",
    [string]$TargetTier = "PaidOnly" # Options: PaidOnly, All, Defense, Academic
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PROCESSING EARLY ACCESS NEWSLETTER DISPATCH" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$templatePath = "$env:USERPROFILE\hive-eds-360\templates\$TemplateName"
if (-not (Test-Path $templatePath)) {
    Write-Host "[ERROR] Template $TemplateName not found!" -ForegroundColor Red
    return
}

$rawTemplate = Get-Content$templatePath -Raw
$subscriberFile = "$env:USERPROFILE\hive-eds-360\trackers\newsletter_subscribers.json"
if (-not (Test-Path $subscriberFile)) {$initialSubs = @(
        @{ email = "dassenseibsu@pm.me"; tier = "Defense"; early_access = $true; joined = (Get-Date).ToString("o") }
    )
    $initialSubs \vert{} ConvertTo-Json \vert{} Set-Content -Path$subscriberFile -Encoding UTF8
}

$subscribers = Get-Content$subscriberFile | ConvertFrom-Json

# Filter Subscribers by Access Level
if ($TargetTier -eq "PaidOnly") {
    $recipients = $subscribers \vert{} Where-Object {$_.tier -in @("Basic", "Defense", "Academic") }
} else {
    $recipients =$subscribers
}

$renderedHtml = $rawTemplate -replace '\{\{SUBJECT\}\}', "[EARLY ACCESS] $Subject" `
                             -replace '\{\{BODY_CONTENT\}\}', $BodyContent `
                             -replace '\{\{ACTION_TEXT\}\}', $ActionText `
                             -replace '\{\{ACTION_URL\}\}', $ActionUrl `
                             -replace '\{\{RECIPIENT_TIER\}\}', $TargetTier

$dispatchPayload = @{
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    embargo_status = "48_HOUR_EARLY_ACCESS"
    target_tier = $TargetTier
    recipients_queued = $recipients.Count
    rendered_html = $renderedHtml
}

$outputPath = "$env:USERPROFILE\hive-eds-360\trackers\latest_dispatch.json"
$dispatchPayload \vert{} ConvertTo-Json -Depth 5 \vert{} Set-Content -Path$outputPath -Encoding UTF8

Write-Host "[SUCCESS] Early access newsletter generated for $(${recipients}.Count) paid members!" -ForegroundColor Green
Write-Host "[LOG] Dispatch payload saved to trackers/latest_dispatch.json" -ForegroundColor Yellow
