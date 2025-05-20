# Deploy frontend to Netlify
# Use this script after the backend is deployed to Render.com

Write-Host "🚀 Preparing to deploy your frontend to Netlify" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Step 1: Update API URL
Write-Host "Updating API URL in config.js..." -ForegroundColor Cyan
Set-Location -Path ".\frontend"

# Check if backend URL is set
$backendURL = Read-Host -Prompt "Enter your backend URL (e.g., https://coding-challenge-backend.onrender.com)"
if ([string]::IsNullOrWhiteSpace($backendURL)) {
    $backendURL = "https://coding-challenge-backend.onrender.com"
    Write-Host "Using default URL: $backendURL" -ForegroundColor Yellow
}

# Update config.js with the backend URL
$configPath = "src\config.js"
$configContent = Get-Content -Path $configPath
$configContent = $configContent -replace "https://coding-challenge-backend.onrender.com", $backendURL
Set-Content -Path $configPath -Value $configContent

# Step 2: Build and deploy
Write-Host "Building and deploying to Netlify..." -ForegroundColor Cyan
npm run build

# Verify if netlify CLI is installed
$netlifyInstalled = $null
try {
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if ($null -eq $netlifyInstalled) {
    Write-Host "Netlify CLI is not installed. Installing globally..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Deploy to Netlify
netlify deploy --prod

# Step 3: Push changes to GitHub
Write-Host "Pushing changes to GitHub..." -ForegroundColor Yellow
Set-Location -Path ".."
git add .

# Get commit message from user
$commitMessage = Read-Host -Prompt "Enter a commit message"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update frontend for Netlify deployment"
}

git commit -m $commitMessage
git push origin main

Write-Host "Frontend deployment complete!" -ForegroundColor Green
Write-Host "Your full-stack application is now deployed!" -ForegroundColor Green
