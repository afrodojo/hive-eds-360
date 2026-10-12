param(
    [string]$Action = "List",
    [string]$ChannelId = "",
    [string]$Platform = "",
    [string]$Handle = "",
    [string]$WebhookUrl = "",
    [string[]]$SeoKeywords = @(),
    [double]$SeoWeight = 1.0
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK DYNAMIC SOCIAL & SEO ADAPTER ENGINE       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$configFile = "$env:USERPROFILE\hive-eds-360\trackers\social_channels_config.json"
$trackersDir = Split-Path $configFile
if (-not (Test-Path $trackersDir)) { New-Item -ItemType Directory -Path $trackersDir -Force | Out-Null }

if (-not (Test-Path $configFile)) {
    $defaultConfig = @(
        [PSCustomObject]@{ id="fb_msg_01"; platform="Facebook Messenger"; handle="@HiveNetworkMessenger"; webhook="https://hive.eds-360.com/webhooks/messenger"; seo_keywords=@("RAG", "defense", "air-gapped"); seo_weight=1.5; active=$true },
        [PSCustomObject]@{ id="yt_chan_01"; platform="YouTube Comments"; handle="@HiveNetworkLabs"; webhook="https://hive.eds-360.com/webhooks/youtube"; seo_keywords=@("SBIR", "grant", "dissertation"); seo_weight=1.4; active=$true },
        [PSCustomObject]@{ id="li_page_01"; platform="LinkedIn Page"; handle="Hive Network Org"; webhook="https://hive.eds-360.com/webhooks/linkedin"; seo_keywords=@("dual-use", "partnerships", "zero-trust"); seo_weight=1.2; active=$true }
    )
    $defaultConfig | ConvertTo-Json -Depth 4 | Set-Content -Path $configFile -Encoding UTF8
}

$channels = @(Get-Content $configFile -Raw | ConvertFrom-Json)

if ($Action -eq "Add") {
    if ([string]::IsNullOrWhiteSpace($ChannelId) -or [string]::IsNullOrWhiteSpace($Platform)) {
        Write-Host "[ERROR] -ChannelId and -Platform are required to add a channel." -ForegroundColor Red
        exit 1
    }
    $newChannel = [PSCustomObject]@{
        id           = $ChannelId
        platform     = $Platform
        handle       = $Handle
        webhook      = $WebhookUrl
        seo_keywords = $SeoKeywords
        seo_weight   = $SeoWeight
        active       = $true
    }
    $channels += $newChannel
    $channels | ConvertTo-Json -Depth 4 | Set-Content -Path $configFile -Encoding UTF8
    Write-Host "[SUCCESS] Added social channel $ChannelId ($Platform) to registry." -ForegroundColor Green
} else {
    Write-Host "
Registered Social Channels & Dynamic SEO Rules:" -ForegroundColor Yellow
    $channels | Format-Table -Property id, platform, handle, seo_weight, active -AutoSize
}
