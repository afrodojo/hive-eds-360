Set-Location "$env:USERPROFILE\hive-eds-360"

# 1. Convert headshot to Base64
$imgPath = "$env:USERPROFILE\hive-eds-360\assets\asaad-morman.jpg"
if (Test-Path $imgPath) {
    Write-Host " [1/5] Converting asaad-morman.jpg to Base64 string..." -ForegroundColor Green
    $bytes = [System.IO.File]::ReadAllBytes($imgPath)
    $b64 = [System.Convert]::ToBase64String($bytes)
    $dataUri = "data:image/jpeg;base64,$b64"
} else {
    Write-Host " [ERROR]: Image file not found at $imgPath" -ForegroundColor Red
    return
}

# 2. Embed Base64 string in index.html
$indexPath = "$env:USERPROFILE\hive-eds-360\index.html"
$html = Get-Content $indexPath -Raw$imgTag = "<img src=`"$dataUri`" alt=`"Asaad Morman`" class=`"w-full h-full object-cover rounded-2xl shadow-lg`">"
$html =$html -replace '(?s)<div class="relative w-48 h-48.*?>.*?</div>', "<div class=`"relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl shadow-blue-950/40 bg-gray-900 flex items-center justify-center`">$imgTag</div>"
[System.IO.File]::WriteAllText($indexPath,$html, [System.Text.Encoding]::UTF8)
Write-Host " [2/5] Embedded Base64 image into index.html" -ForegroundColor Green

# 3. Synchronize all files to deploy-site directory
$deployDir = "$env:USERPROFILE\hive-eds-360\deploy-site"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

$itemsToInclude = @("index.html", "pricing.html", "auth.html", "portal.html", "admin.html", "blog.html", "RAG-console.html", "research.html", "favicon.ico", "assets", "css", "js", "images", "trackers")

foreach ($item in$itemsToInclude) {
    $itemPath = "$env:USERPROFILE\hive-eds-360\$item"
    if (Test-Path $itemPath) {
        Copy-Item -Path $itemPath -Destination$deployDir -Recurse -Force
        Write-Host " [Synced]: $item" -ForegroundColor Green
    }
}

# 4. Rebuild deploy-site.zip
$zipPath = "$env:USERPROFILE\hive-eds-360\deploy-site.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force
Write-Host " [3/5] Rebuilt deploy-site.zip successfully!" -ForegroundColor Green

# 5. Git Commit & Push
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
git add -A
git commit -m "Embedded headshot as inline Base64 data string in index.html and restored deploy-site"
git push origin main
Write-Host " [4/5] Pushed updates to GitHub" -ForegroundColor Green

# Remove temporary script
Remove-Item "$env:USERPROFILE\hive-eds-360\fix-deploy.ps1" -Force
Write-Host " [5/5] Workspace folder opening..." -ForegroundColor Green
Invoke-Item "$env:USERPROFILE\hive-eds-360"
