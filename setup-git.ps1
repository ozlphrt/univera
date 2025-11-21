# Git Setup Script for Univera
# Run this script to configure git and prepare for GitHub push

Write-Host "=== Univera Git Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git user is configured
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "Git user configuration needed:" -ForegroundColor Yellow
    Write-Host ""
    
    if (-not $userName) {
        $name = Read-Host "Enter your name (for git commits)"
        git config user.name $name
    }
    
    if (-not $userEmail) {
        $email = Read-Host "Enter your email (for git commits)"
        git config user.email $email
    }
    
    Write-Host ""
    Write-Host "Git user configured!" -ForegroundColor Green
} else {
    Write-Host "Git user already configured:" -ForegroundColor Green
    Write-Host "  Name: $userName"
    Write-Host "  Email: $userEmail"
    Write-Host ""
}

# Show current status
Write-Host "Current git status:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a GitHub repository at https://github.com/new"
Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/univera.git"
Write-Host "3. Run: git commit -m 'feat(initial): complete college matching system'"
Write-Host "4. Run: git push -u origin main"
Write-Host ""
Write-Host "Or use the GitHub CLI (gh) if installed:" -ForegroundColor Cyan
Write-Host "  gh repo create univera --public --source=. --remote=origin --push"

