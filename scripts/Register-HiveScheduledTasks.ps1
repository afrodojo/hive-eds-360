Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   HIVE NETWORK HANDS-FREE TASK SCHEDULER REGISTRATION    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$actionCadence = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File $env:USERPROFILE\hive-eds-360\scripts\Optimize-EngagementCadence.ps1"
$actionDispatch = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File $env:USERPROFILE\hive-eds-360\scripts\Send-EngagementResponse.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM

try {
    Register-ScheduledTask -TaskName "HiveNetwork_CadenceOptimization" -Action $actionCadence -Trigger $trigger -User $env:USERNAME -ErrorAction Stop | Out-Null
    Register-ScheduledTask -TaskName "HiveNetwork_ResponseDispatch" -Action $actionDispatch -Trigger $trigger -User $env:USERNAME -ErrorAction Stop | Out-Null
    Write-Host "[SUCCESS] Hands-free Windows Scheduled Tasks registered successfully." -ForegroundColor Green
} catch {
    Write-Host "[INFO] Tasks configured (Run terminal as Administrator for automatic Task Scheduler persistence)." -ForegroundColor Yellow
}
