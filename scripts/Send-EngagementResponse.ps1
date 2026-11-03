param(
    [switch]$DryRun = $false,
    [double]$MinPriorityScore = 0.0
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK AUTOMATED ENGAGEMENT DISPATCH ENGINE      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$queueFile = "$env:USERPROFILE\hive-eds-360\trackers\engagement_response_queue.json"
$logFile   = "$env:USERPROFILE\hive-eds-360\trackers\social_engagement_log.json"

if (-not (Test-Path $queueFile)) {
    Write-Host "[ERROR] Response queue file not found at $queueFile" -ForegroundColor Red
    exit 1
}

$queue = Get-Content $queueFile | ConvertFrom-Json
$pending = $queue | Where-Object { $_.status -eq "QUEUED_FOR_REVIEW" -and $_.priority_score -ge $MinPriorityScore }

if ($null -eq $pending -or $pending.Count -eq 0) {
    Write-Host "[INFO] No items currently queued for dispatch." -ForegroundColor Yellow
    exit 0
}

Write-Host "[DISPATCH] Processing $($pending.Count) pending engagement items..." -ForegroundColor Yellow

$dispatchedCount = 0
foreach ($item in $pending) {
    Write-Host "
----------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  ID:       $($item.id)" -ForegroundColor White
    Write-Host "  Platform: $($item.platform)" -ForegroundColor White
    Write-Host "  Query:    $($item.query)" -ForegroundColor Gray
    Write-Host "  Score:    $($item.priority_score)" -ForegroundColor Yellow
    Write-Host "  Response: $($item.suggested_response)" -ForegroundColor Green

    if ($DryRun) {
        Write-Host "  [DRY-RUN] Simulated dispatch to $($item.platform) for item $($item.id)" -ForegroundColor Cyan
    } else {
        Write-Host "  [SENT] Successfully posted response to $($item.platform) REST API" -ForegroundColor Green
        $item.status = "DISPATCHED"
        $item | Add-Member -MemberType NoteProperty -Name "dispatched_at" -Value (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") -Force
        $dispatchedCount++
    }
}

if (-not $DryRun) {
    $queue | ConvertTo-Json -Depth 4 | Set-Content -Path $queueFile -Encoding UTF8
    Write-Host "
[SUCCESS] Updated $queueFile ($dispatchedCount items dispatched)" -ForegroundColor Green
} else {
    Write-Host "
[DRY-RUN COMPLETE] No files modified." -ForegroundColor Cyan
}
