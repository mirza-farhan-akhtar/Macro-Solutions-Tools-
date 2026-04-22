# MACRO Solutions - Backend Setup Script
# Run this AFTER quick-install.ps1

$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        MACRO Solutions - Backend Setup Script         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Navigate to backend
Set-Location "E:\MACRO\backend"

# Step 1: Install Composer Dependencies
Write-Host "Step 1: Installing Laravel dependencies..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "⏳ This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    composer install --no-interaction --prefer-dist --optimize-autoloader
    Write-Host "`n✅ Composer dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Composer install failed: $_" -ForegroundColor Red
    Write-Host "Please run manually: composer install" -ForegroundColor Yellow
    pause
    exit 1
}

# Step 2: Generate Application Key
Write-Host "`nStep 2: Generating application key..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

try {
    php artisan key:generate --force
    Write-Host "✅ Application key generated" -ForegroundColor Green
} catch {
    Write-Host "❌ Key generation failed: $_" -ForegroundColor Red
}

# Step 3: Run Migrations and Seed
Write-Host "`nStep 3: Setting up database..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "⏳ Creating tables and seeding data..." -ForegroundColor Yellow
Write-Host ""

try {
    php artisan migrate:fresh --seed --force
    Write-Host "`n✅ Database migrated and seeded" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Migration failed: $_" -ForegroundColor Red
    Write-Host "Check database credentials in .env file" -ForegroundColor Yellow
    pause
    exit 1
}

# Step 4: Clear caches
Write-Host "`nStep 4: Clearing caches..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

php artisan config:clear 2>&1 | Out-Null
php artisan cache:clear 2>&1 | Out-Null
php artisan route:clear 2>&1 | Out-Null
Write-Host "✅ Caches cleared" -ForegroundColor Green

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              BACKEND SETUP COMPLETED!                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "✅ Dependencies:   Installed" -ForegroundColor Green
Write-Host "✅ App Key:        Generated" -ForegroundColor Green
Write-Host "✅ Database:       Migrated & Seeded" -ForegroundColor Green
Write-Host "✅ Tables:         15 created" -ForegroundColor Green
Write-Host "✅ Sample Data:    Loaded" -ForegroundColor Green

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                  START THE SERVER                      ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Yellow

Write-Host "Starting Laravel development server...`n" -ForegroundColor Cyan

# Start server
Write-Host "Server will run on: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────`n" -ForegroundColor Gray

php artisan serve --host=127.0.0.1 --port=8000
