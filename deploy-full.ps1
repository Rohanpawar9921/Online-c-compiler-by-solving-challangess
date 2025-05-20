# Full Deployment Script for Coding Challenge Platform
# This script will deploy both backend and frontend

Write-Host "🚀 Starting full deployment" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Prompt for what to deploy
$deployChoice = Read-Host "What would you like to deploy? (B)ackend, (F)rontend, or (A)ll"

if ($deployChoice -eq "B" -or $deployChoice -eq "b" -or $deployChoice -eq "A" -or $deployChoice -eq "a") {
    # Deploy backend first
    Write-Host "`n📦 Deploying backend to Render.com..." -ForegroundColor Cyan
    
    # Run the backend deployment script
    & .\deploy-render-fixed.ps1
    
    # Get the backend URL
    $backendURL = Read-Host "`nEnter your deployed backend URL (e.g., https://coding-challenge-backend.onrender.com)"
    if ([string]::IsNullOrWhiteSpace($backendURL)) {
        $backendURL = "https://coding-challenge-backend.onrender.com"
        Write-Host "Using default URL: $backendURL" -ForegroundColor Yellow
    }
    
    # Update the backend URL in config.js
    $configPath = ".\frontend\src\config.js"
    $configContent = Get-Content -Path $configPath
    $configContent = $configContent -replace "https://[^']*'", "$backendURL'"
    Set-Content -Path $configPath -Value $configContent
    
    Write-Host "Updated frontend config.js with backend URL: $backendURL" -ForegroundColor Green
}

if ($deployChoice -eq "F" -or $deployChoice -eq "f" -or $deployChoice -eq "A" -or $deployChoice -eq "a") {
    # Deploy frontend to Netlify
    Write-Host "`n🌐 Deploying frontend to Netlify..." -ForegroundColor Cyan
    
    # Run the frontend deployment script
    & .\deploy-netlify.ps1
}

Write-Host "`n✅ Deployment process completed!" -ForegroundColor Green
Write-Host "Backend URL: https://coding-challenge-backend.onrender.com (or your custom URL)" -ForegroundColor White
Write-Host "Frontend URL: Check your Netlify dashboard for the URL" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Test your application by visiting your Netlify URL" -ForegroundColor White
Write-Host "2. Update ALLOWED_ORIGINS in Render.com to include your Netlify URL" -ForegroundColor White
Write-Host "3. Set up custom domains if needed" -ForegroundColor White
