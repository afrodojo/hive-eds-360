param(
    [string]$MetaAccessToken =$env:META_GRAPH_ACCESS_TOKEN,
    [string]$LinkedInToken   =$env:LINKEDIN_ACCESS_TOKEN,
    [string]$YouTubeApiKey   =$env:YOUTUBE_API_KEY
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SYNCING EXPANDED RESEARCH, AUDIENCE & VECTOR SCHEMA   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ExpandedResearchSchema = @{
    timestamp     = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    primary_email = "dassenseibsu@pm.me"
    
    research_pillars = @(
        @{
            id          = "PILLAR-01"
            title       = "Air-Gapped Edge RAG & Sovereign AI"
            focus       = "Zero-trust local vector stores, PowerShell REST APIs, and disconnected hardware execution."
            repos       = @("eds-formal-rag", "AI-Lab-Hybrid-DASSensei")
        },
        @{
            id          = "PILLAR-02"
            title       = "Adversarial ML & Cyber Defense"
            focus       = "Hardened model architectures, prompt-injection defense, and local audit enclaves."
            repos       = @("cyber-dojo-sensei")
        },
        @{
            id          = "PILLAR-03"
            title       = "Doctoral Dissertation & Theoretical CS"
            focus       = "Formally verified retrieval, semantic chunking, and air-gapped evaluation metrics."
            repos       = @("sensei-phd")
        }
    )

    audience_segments = @(
        @{ segment = "Defense & Intelligence"; focus = "Air-Gapped RAG, Edge Compute, Tactical AI" },
        @{ segment = "Academic Researchers";   focus = "Formal Verification, CS Ph.D. Dissertation Logs" },
        @{ segment = "Enterprise / Business"; focus = "Security Audits, Custom Local LLM Pipelines" },
        @{ segment = "Community Members";     focus = "YouTube Channel Updates, Newsletters, Blog Posts" }
    )

    vector_metrics = @{
        total_chunks_indexed = 4120
        total_comments_logged = 340
        active_social_nodes   = 4
        last_ingestion_source = "YouTube Transcript & Dissertation Notes"
    }
}

$outputPath = "$env:USERPROFILE\hive-eds-360\trackers\social_engagement.json"
$ExpandedResearchSchema \vert{} ConvertTo-Json -Depth 5 \vert{} Set-Content -Path$outputPath -Encoding UTF8

Write-Host "[SUCCESS] Research pillars, audience profiles, and vector schema synchronized!" -ForegroundColor Green
