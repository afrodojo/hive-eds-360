param(
    [string]$TemplateName = "newsletter_default.html",
    [string]$Subject = "The Hive Network Technical Dispatch",
    [string]$BodyContent = "Custom research notes and security audit updates.",
    [string]$ActionText = "Explore RAG Terminal",
    [string]$ActionUrl = "https://hive.eds-360.com/RAG-console.html",
    [string]$TargetTier = "All"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PROCESSING DYNAMIC HIVE NEWSLETTER CUSTOMIZATION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$templatePath = "$env:USERPROFILE\hive-eds-360\templates\$TemplateName"
if (-not (Test-Path $templatePath)) {
    Write-Host "[ERROR] Template file $TemplateName not found!" -ForegroundColor Red
    return
}

$rawTemplate = Get-Content $templatePath -Raw

# Load Subscribers
$subscriberFile = "$env:USERPROFILE\hive-eds-360\trackers\newsletter_subscribers.json"
if (-not (Test-Path $subscriberFile)) {
    $initialSubs = @(
        @{ email = "dassenseibsu@pm.me"; tier = "Defense"; joined = (Get-Date).ToString("o") }
    )
    $initialSubs | ConvertTo-Json | Set-Content -Path $subscriberFile -Encoding UTF8
}

$subscribers = Get-Content $subscriberFile | ConvertFrom-Json

# Compile Rendered Output
$renderedHtml = $rawTemplate -replace '\{\{SUBJECT\}\}', $Subject `
                             -replace '\{\{BODY_CONTENT\}\}', $BodyContent `
                             -replace '\{\{ACTION_TEXT\}\}', $ActionText `
                             -replace '\{\{ACTION_URL\}\}', $ActionUrl `
                             -replace '\{\{RECIPIENT_TIER\}\}', $TargetTier

$dispatchPayload = @{
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    template_used = $TemplateName
    subject = $Subject
    target_tier = $TargetTier
    rendered_html = $renderedHtml
    recipients_queued = $subscribers.Count
}

$outputPath = "$env:USERPROFILE\hive-eds-360\trackers\latest_dispatch.json"
$dispatchPayload | ConvertTo-Json -Depth 5 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "[SUCCESS] Rendered custom newsletter compiled!" -ForegroundColor Green
Write-Host "[LOG] Preview output saved to trackers/latest_dispatch.json" -ForegroundColor Yellow
