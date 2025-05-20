# Master script for Coding Challenge Platform
# This script provides options for both development and deployment

function Show-Menu {
    Clear-Host
    Write-Host "=======================================" -ForegroundColor Blue
    Write-Host "  CODING CHALLENGE PLATFORM TOOLKIT" -ForegroundColor Blue
    Write-Host "=======================================" -ForegroundColor Blue
    Write-Host
    Write-Host "DEVELOPMENT OPTIONS" -ForegroundColor Green
    Write-Host "1. Start backend (localhost:5000)"
    Write-Host "2. Start frontend (localhost:3000)"
    Write-Host "3. Start both backend and frontend"
    Write-Host "4. Test database connection"
    Write-Host "5. Run in Docker containers"
    Write-Host
    Write-Host "DEPLOYMENT OPTIONS" -ForegroundColor Yellow
    Write-Host "6. Deploy backend to Render.com"
    Write-Host "7. Deploy frontend to Netlify"
    Write-Host "8. Deploy both (backend first, then frontend)"
    Write-Host
    Write-Host "UTILITIES" -ForegroundColor Cyan
    Write-Host "9. Update API URLs in frontend"
    Write-Host "10. Initialize project (install dependencies)"
    Write-Host "11. Exit"
    Write-Host
}

function Start-Backend {
    Write-Host "`nStarting backend server..." -ForegroundColor Cyan
    Set-Location -Path "$PSScriptRoot\backend"
    npm run dev
}

function Start-Frontend {
    Write-Host "`nStarting frontend dev server..." -ForegroundColor Cyan
    Set-Location -Path "$PSScriptRoot\frontend"
    npm start
}

function Start-Both {
    Write-Host "`nStarting both backend and frontend..." -ForegroundColor Cyan
    Start-Process powershell.exe -ArgumentList "-NoExit -Command `"Set-Location '$PSScriptRoot\backend'; npm run dev`""
    Start-Process powershell.exe -ArgumentList "-NoExit -Command `"Set-Location '$PSScriptRoot\frontend'; npm start`""
}

function Test-Database {
    Write-Host "`nTesting database connection..." -ForegroundColor Cyan
    Set-Location -Path "$PSScriptRoot\backend"
    npm run test:db
}

function Start-Docker {
    Write-Host "`nStarting Docker containers..." -ForegroundColor Cyan
    Set-Location -Path $PSScriptRoot
    docker-compose up --build
}

function Deploy-Backend {
    Write-Host "`nDeploying backend to Render.com..." -ForegroundColor Yellow
    Set-Location -Path $PSScriptRoot
    .\deploy-render-fixed.ps1
}

function Deploy-Frontend {
    Write-Host "`nDeploying frontend to Netlify..." -ForegroundColor Yellow
    Set-Location -Path $PSScriptRoot
    .\deploy-netlify.ps1
}

function Deploy-Both {
    Write-Host "`nDeploying backend and frontend..." -ForegroundColor Yellow
    Set-Location -Path $PSScriptRoot
    .\deploy-full.ps1
}

function Update-ApiUrls {
    Write-Host "`nUpdating API URLs in frontend..." -ForegroundColor Cyan
    
    $backendUrl = Read-Host "Enter backend URL (or leave blank for http://localhost:5000)"
    if ([string]::IsNullOrWhiteSpace($backendUrl)) {
        $backendUrl = "http://localhost:5000"
    }
    
    # Update config.js
    $configPath = Join-Path -Path $PSScriptRoot -ChildPath "frontend\src\config.js"
    $configContent = Get-Content -Path $configPath
    $updatedContent = $configContent -replace "const API_URL = process\.env\.NODE_ENV === 'production'[^;]+;", "const API_URL = process.env.NODE_ENV === 'production' ? '$backendUrl' : 'http://localhost:5000';"
    Set-Content -Path $configPath -Value $updatedContent
    
    # Run the update-api-urls.js script
    Set-Location -Path "$PSScriptRoot\frontend"
    node update-api-urls.js
    
    Write-Host "API URLs updated to use: $backendUrl" -ForegroundColor Green
}

function Initialize-Project {
    Write-Host "`nInitializing project..." -ForegroundColor Cyan
    
    # Install backend dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor White
    Set-Location -Path "$PSScriptRoot\backend"
    npm install
    
    # Install frontend dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor White
    Set-Location -Path "$PSScriptRoot\frontend"
    npm install
    
    Write-Host "Project initialized successfully!" -ForegroundColor Green
}

# Main loop
$choice = 0
while ($choice -ne 11) {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-11)"
    
    switch ($choice) {
        1 { Start-Backend }
        2 { Start-Frontend }
        3 { Start-Both }
        4 { Test-Database }
        5 { Start-Docker }
        6 { Deploy-Backend }
        7 { Deploy-Frontend }
        8 { Deploy-Both }
        9 { Update-ApiUrls }
        10 { Initialize-Project }
        11 { Write-Host "`nExiting..." -ForegroundColor Red }
        default { Write-Host "`nInvalid choice. Please try again." -ForegroundColor Red }
    }
    
    if ($choice -ne 11 -and $choice -in 1..10) {
        Write-Host "`nPress any key to return to the menu..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}
