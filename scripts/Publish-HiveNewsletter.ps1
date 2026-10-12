param(
    [string]$Subject = "The Hive Network Technical Dispatch: Sovereign AI Updates",
    [string]$MessageBody = "This dispatch covers new air-gapped RAG benchmarks and zero-trust gateway security patches."
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   COMPILING AND DISPATCHING HIVE NETWORK NEWSLETTER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$subscriberFile = "$env:USERPROFILE\hive-eds-360\trackers\newsletter_subscribers.json"
if (-not (Test-Path $subscriberFile)) {$initialSubs = @(
        @{ email = "dassenseibsu@pm.me"; tier = "Defense"; joined = (Get-Date).ToString("o") }
    )
    $initialSubs \vert{} ConvertTo-Json \vert{} Set-Content -Path$subscriberFile -Encoding UTF8
}

$subscribers = Get-Content$subscriberFile | ConvertFrom-Json

$newsletterPayload = @{
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    subject = $Subject
    body = $MessageBody
    recipient_count = $subscribers.Count
    status = "DISPATCHED_LOCAL"
}

$newsletterPayload \vert{} ConvertTo-Json \vert{} Out-File -FilePath "$env:USERPROFILE\hive-eds-360\trackers\latest_dispatch.json" -Encoding UTF8

Write-Host "[SUCCESS] Newsletter compiled and queued for $(${subscribers}.Count) subscribers!" -ForegroundColor Green
Write-Host "[LOG] Dispatch payload saved to trackers/latest_dispatch.json" -ForegroundColor Yellow
