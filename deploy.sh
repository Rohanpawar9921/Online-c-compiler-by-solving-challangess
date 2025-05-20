#!/bin/bash

# This script helps you deploy changes to GitHub

echo "🚀 Deploying changes to GitHub..."

# Add all changes
git add .

# Commit changes
echo "💬 Enter a commit message:"
read commit_message

# If commit message is empty, use a default message
if [ -z "$commit_message" ]; then
  commit_message="Update application code"
fi

git commit -m "$commit_message"

# Push to GitHub
echo "📤 Pushing changes to GitHub..."
git push origin main

echo "✅ Changes deployed to GitHub!"
echo "🌐 Remember to manually deploy on Render.com by clicking 'Manual Deploy' -> 'Clear build cache & deploy'"
