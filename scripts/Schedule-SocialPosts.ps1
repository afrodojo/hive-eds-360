param(
    [string]$Topic = "Air-Gapped RAG Security",
    [string]$TargetPlatform = "All"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   GENERATING AUTOMATED SOCIAL POST QUEUE FOR HIVE NETWORK" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$postQueue = @(
    @{
        day = "Monday"
        topic = "Sovereign Edge RAG vs Cloud Vulnerabilities"
        call_to_action = "Test live vector console: https://hive.eds-360.com/RAG-console.html"
        hashtags = "#SovereignAI #CyberSecurity #EdgeRAG #DASSensei"
    },
    @{
        day = "Wednesday"
        topic = "Adversarial Prompt Injection Defenses in Local LLMs"
        call_to_action = "Explore SBIR capability statement: https://hive.eds-360.com/research.html"
        hashtags = "#AdversarialML #DefenseTech #SBIR #PhDResearch"
    },
    @{
        day = "Friday"
        topic = "CS Ph.D. Dissertation Notes & Mathematical Retrieval Bounds"
        call_to_action = "Watch full technical breakdown on YouTube: @DASSensei"
        hashtags = "#ComputerScience #PhDLife #AIResearch #TheHiveNetwork"
    }
)

$outputPath = "$env:USERPROFILE\hive-eds-360\trackers\social_content_queue.json"
$postQueue | ConvertTo-Json -Depth 3 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "[SUCCESS] Social post queue generated and saved to trackers/social_content_queue.json!" -ForegroundColor Green
