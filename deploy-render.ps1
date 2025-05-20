# Push changes to GitHub and deploy to Render.com

Write-Host "🚀 Preparing to deploy your backend to Render.com" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Step 1: Test database connection
Write-Host "`n🔍 Testing database connection..." -ForegroundColor Cyan
Set-Location -Path ".\backend"
npm run test:db

# Step 2: Run the Render setup script
Write-Host "`n📋 Running Render setup script..." -ForegroundColor Cyan
npm run render-setup

# Step 3: Push changes to GitHub
Write-Host "`n📤 Pushing changes to GitHub..." -ForegroundColor Yellow
Set-Location -Path ".."
git add .

# Get commit message from user
$commitMessage = Read-Host -Prompt "Enter a commit message"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update backend for Render.com deployment"
}

git commit -m $commitMessage
git push origin main

# Step 4: Instructions for Render.com
Write-Host "`n🌐 Final Steps on Render.com:" -ForegroundColor Green
Write-Host "1. Go to your Render.com dashboard: https://dashboard.render.com/" -ForegroundColor White
Write-Host "2. Select your web service" -ForegroundColor White
Write-Host "3. Navigate to the 'Environment' tab and verify these variables are set:" -ForegroundColor White
Write-Host "   - MONGO_URI" -ForegroundColor Yellow
Write-Host "   - JWT_SECRET" -ForegroundColor Yellow
Write-Host "   - NODE_ENV=production" -ForegroundColor Yellow
Write-Host "   - ALLOWED_ORIGINS=*" -ForegroundColor Yellow
Write-Host "4. Click 'Manual Deploy' > 'Clear build cache & deploy'" -ForegroundColor White
Write-Host "5. Monitor the logs for any errors" -ForegroundColor White

Write-Host "`n✅ Deployment preparation complete!" -ForegroundColor Green
