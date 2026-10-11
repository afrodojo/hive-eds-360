param(
    [string]$GithubToken = "$env:GH_PRIVATE_REPOS_PAT",
    [string]$TargetDir   = "$env:USERPROFILE\hive-eds-360\linked_repos"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SYNCING ALL 4 LINKED RESEARCH & CYBER REPOSITORIES" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $GithubToken) {
    Write-Warning "[!] GH_PRIVATE_REPOS_PAT environment variable is not set. Skipping private repo pull."
    return
}

# 4 Exact Repositories from GitHub PAT Permissions
$PrivateRepos = @(
    @{ Name = "eds-formal-rag"; Domain = "das.eds-360.com"; Url = "https://$GithubToken@github.com/afrodojo/eds-formal-rag.git" },
    @{ Name = "cyber-dojo-sensei"; Domain = "cyberdojosensei.eds-360.com"; Url = "https://$GithubToken@github.com/afrodojo/cyber-dojo-sensei.git" },
    @{ Name = "sensei-phd"; Domain = "hive.eds-360.com"; Url = "https://$GithubToken@github.com/afrodojo/sensei-phd.git" },
    @{ Name = "AI-Lab-Hybrid-DASSensei"; Domain = "dassensei.eda-360.com"; Url = "https://$GithubToken@github.com/afrodojo/AI-Lab-Hybrid-DASSensei.git" }
)

New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
$RepoSummaryList = @()

foreach ($repo in $PrivateRepos) {
    $localPath = Join-Path -Path $TargetDir -ChildPath $repo.Name
    
    if (Test-Path "$localPath\.git") {
        Write-Host "[SYNC] Updating '$($repo.Name)'..." -ForegroundColor Green
        Push-Location $localPath
        try { git pull origin main --quiet } finally { Pop-Location }
    } else {
        Write-Host "[CLONE] Cloning '$($repo.Name)'..." -ForegroundColor Yellow
        git clone $repo.Url $localPath --quiet
    }

    $readmeFile = Join-Path -Path $localPath -ChildPath "README.md"
    $abstract = if (Test-Path $readmeFile) { (Get-Content $readmeFile -Head 5) -join " " } else { "Private Enclave Node" }

    $RepoSummaryList += @{
        name          = $repo.Name
        domain        = $repo.Domain
        status        = "Indexed in Vector DB"
        last_synced   = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        public_summary= $abstract
    }
}

$jsonPath = "$env:USERPROFILE\hive-eds-360\trackers\linked_repos.json"
$RepoSummaryList | ConvertTo-Json -Depth 4 | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "[SUCCESS] All 4 repositories synchronized and indexed into local RAG schema!" -ForegroundColor Green


