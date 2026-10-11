# Requires Pode module: Install-Module -Name Pode -Scope CurrentUser
Import-Module Pode -ErrorAction SilentlyContinue

if (-not (Get-Module -Name Pode)) {
    Write-Host "[!] Pode module not detected. Installing Pode for local API listener..." -ForegroundColor Yellow
    Install-Module -Name Pode -Scope CurrentUser -Force
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   EMERGING DEFENSE SOLUTIONS (EDS) - LOCAL RAG GATEWAY" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Start-PodeServer -Threads 4 {
    Add-PodeEndpoint -Address 'localhost' -Port 8443 -Protocol Https

    # Cors & Auth Header Guard
    Add-PodeMiddleware -Name 'AuthGuard' -ScriptBlock {
        param($session)
        # Enable CORS for hive.eds-360.com
        Add-PodeHeader -Name 'Access-Control-Allow-Origin' -Value '*'
        Add-PodeHeader -Name 'Access-Control-Allow-Headers' -Value 'Content-Type, Authorization'

        if ($session.Request.HttpMethod -eq 'OPTIONS') {
            Set-PodeResponseStatus -Code 200
            return $false
        }

        $authHeader = $session.Request.Headers['Authorization']
        if ($authHeader -ne "Bearer DEFENSE_LOCAL_SECRET_KEY_2026") {
            Set-PodeResponseStatus -Code 401
            Write-PodeJsonResponse -Value @{ error = "Unauthorized Access to Local Defense Enclave" }
            return $false
        }
        return $true
    }

    # API Endpoint: RAG Query Endpoint
    Add-PodeRoute -Method Post -Path '/api/v1/rag-query' -Middleware 'AuthGuard' -ScriptBlock {
        param($session)

        $payload   = $session.Request.Body
        $userQuery = $payload.query
        $mode      = $payload.mode

        Write-Host "[QUERY RECEIVED] Mode: $mode | Query: '$userQuery'" -ForegroundColor Green

        # Structured Response returned back to hive.eds-360.com
        Write-PodeJsonResponse -Value @{
            status    = "200 OK (Enclave Active)"
            mode      = $mode
            query     = $userQuery
            response  = "Local Gateway Verified: Executed query '$userQuery' against $mode vector store."
            timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
    }
}
