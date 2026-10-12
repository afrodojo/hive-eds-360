Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   RUNNING HIVE SECURITY & HEALTH HEARTBEAT AUDIT" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$results = [ordered]@{
    Timestamp          = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    LocalGatewayPort   = "Offline"
    YouTubeTokenStatus = if ($env:YOUTUBE_API_KEY) { "PASS" } else { "FAIL (Missing YOUTUBE_API_KEY)" }
    MetaTokenStatus    = if ($env:META_GRAPH_ACCESS_TOKEN) { "PASS" } else { "FAIL (Missing META_GRAPH_ACCESS_TOKEN)" }
    LinkedInTokenStatus= if ($env:LINKEDIN_ACCESS_TOKEN) { "PASS" } else { "FAIL (Missing LINKEDIN_ACCESS_TOKEN)" }
    TrackersDirectory  = if (Test-Path "trackers/social_engagement.json") { "PASS" } else { "WARN (Tracker missing)" }
}

# Test Local RAG Gateway Port 8443
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connection = $tcp.BeginConnect("127.0.0.1", 8443, $null, $null)
    $success = $connection.AsyncWaitHandle.WaitOne(1000, $false)
    if ($success) {
        $results.LocalGatewayPort = "PASS (Port 8443 Open)"
        $tcp.Close()
    } else {
        $results.LocalGatewayPort = "WARN (Port 8443 Closed - Standalone Mode)"
    }
} catch {
    $results.LocalGatewayPort = "WARN (Gateway Offline)"
}

Write-Host ""
$results.GetEnumerator() | ForEach-Object {
    $color = if ($_.Value -like "PASS*") { "Green" } elseif ($_.Value -like "WARN*") { "Yellow" } else { "Red" }
    Write-Host ("{0,-22} : {1}" -f $_.Key, $_.Value) -ForegroundColor $color
}
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
