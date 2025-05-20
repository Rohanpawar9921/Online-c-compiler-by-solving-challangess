# Deploy changes to GitHub and provide guidance on Render.com deployment

Write-Host "🚀 Deploying changes to GitHub..." -ForegroundColor Green

# Add all changes
git add .

# Commit changes
$commitMessage = Read-Host -Prompt "💬 Enter a commit message"

# If commit message is empty, use a default message
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update application code"
}

git commit -m $commitMessage

# Push to GitHub
Write-Host "📤 Pushing changes to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Changes deployed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Remember to manually deploy on Render.com by clicking 'Manual Deploy' -> 'Clear build cache & deploy'" -ForegroundColor Cyan
Write-Host "⚠️ Make sure MONGO_URI environment variable is set on Render.com to:" -ForegroundColor Yellow
Write-Host "mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0" -ForegroundColor Cyan
