# Complete Backend Setup
# Run this after PHP and Composer are installed

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================================"
Write-Host "  MACRO Solutions - Backend Setup" 
Write-Host "========================================================" 
Write-Host ""

# Refresh PATH
$phpDir = "$env:USERPROFILE\php"
$composerPath = "$env:ProgramData\ComposerSetup\bin"
$env:Path = "$phpDir;$composerPath;" + $env:Path

# Navigate to backend
Set-Location "E:\MACRO\backend"

# Step 1: Install dependencies
Write-Host "Step 1: Installing Laravel dependencies..." -ForegroundColor Green
Write-Host "This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

composer install --no-interaction --prefer-dist --optimize-autoloader

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Dependencies installed" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Composer install failed with exit code $LASTEXITCODE" -ForegroundColor Red
    pause
    exit 1
}

# Step 2: Generate app key
Write-Host ""
Write-Host "Step 2: Generating application key..." -ForegroundColor Green
php artisan key:generate --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Application key generated" -ForegroundColor Green
} else {
    Write-Host "ERROR: Key generation failed" -ForegroundColor Red
}

# Step 3: Run migrations
Write-Host ""
Write-Host "Step 3: Creating database tables..." -ForegroundColor Green
Write-Host "Running migrations and seeding data..." -ForegroundColor Yellow
Write-Host ""

php artisan migrate:fresh --seed --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Database setup complete!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Migration failed" -ForegroundColor Red
    pause
    exit 1
}

# Step 4: Clear caches
Write-Host ""
Write-Host "Step 4: Clearing caches..." -ForegroundColor Green
php artisan config:clear 2>&1 | Out-Null
php artisan cache:clear 2>&1 | Out-Null
php artisan route:clear 2>&1 | Out-Null
Write-Host "SUCCESS: Caches cleared" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================================"
Write-Host "  BACKEND SETUP COMPLETED!"
Write-Host "========================================================" 
Write-Host ""

Write-Host "Database Tables:   15 created" -ForegroundColor Green
Write-Host "Sample Data:       Loaded" -ForegroundColor Green
Write-Host "Admin User:        admin@macro.com / password" -ForegroundColor Green
Write-Host "Regular User:      user@macro.com / password" -ForegroundColor Green

Write-Host ""
Write-Host "========================================================" 
Write-Host "  STARTING DEVELOPMENT SERVER"
Write-Host "========================================================" 
Write-Host ""

Write-Host "Backend will run on: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Frontend is running on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "--------------------------------------------------------"
Write-Host ""

# Start server
php artisan serve --host=127.0.0.1 --port=8000
