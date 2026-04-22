# MACRO Solutions - PHP & Composer Installation Script
# Run this in PowerShell as Administrator

Write-Host "=== MACRO Solutions - PHP & Composer Installation ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  WARNING: Not running as Administrator!" -ForegroundColor Yellow
    Write-Host "Some steps may fail. Right-click PowerShell and 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Check if PHP ZIP is downloaded
Write-Host "Step 1: Checking for PHP ZIP file..." -ForegroundColor Green

$downloadsPath = "$env:USERPROFILE\Downloads"
$phpZip = Get-ChildItem -Path $downloadsPath -Filter "php-8.3*.zip" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($phpZip) {
    Write-Host "✅ Found PHP ZIP: $($phpZip.Name)" -ForegroundColor Green
    
    # Step 2: Extract PHP
    Write-Host ""
    Write-Host "Step 2: Extracting PHP to C:\php..." -ForegroundColor Green
    
    if (Test-Path "C:\php") {
        Write-Host "⚠️  C:\php already exists. Skipping extraction." -ForegroundColor Yellow
    } else {
        try {
            Expand-Archive -Path $phpZip.FullName -DestinationPath "C:\php" -Force
            Write-Host "✅ PHP extracted successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to extract PHP: $_" -ForegroundColor Red
            exit 1
        }
    }
    
    # Step 3: Configure php.ini
    Write-Host ""
    Write-Host "Step 3: Configuring PHP..." -ForegroundColor Green
    
    if (-not (Test-Path "C:\php\php.ini")) {
        Copy-Item "C:\php\php.ini-development" "C:\php\php.ini"
        Write-Host "✅ Created php.ini from template" -ForegroundColor Green
        
        # Enable extensions
        $phpIni = Get-Content "C:\php\php.ini"
        $phpIni = $phpIni -replace ';extension=pdo_mysql', 'extension=pdo_mysql'
        $phpIni = $phpIni -replace ';extension=mbstring', 'extension=mbstring'
        $phpIni = $phpIni -replace ';extension=openssl', 'extension=openssl'
        $phpIni = $phpIni -replace ';extension=fileinfo', 'extension=fileinfo'
        $phpIni = $phpIni -replace ';extension=curl', 'extension=curl'
        $phpIni | Set-Content "C:\php\php.ini"
        Write-Host "✅ Enabled required extensions" -ForegroundColor Green
    } else {
        Write-Host "⚠️  php.ini already exists. Skipping configuration." -ForegroundColor Yellow
    }
    
    # Step 4: Add to PATH
    Write-Host ""
    Write-Host "Step 4: Adding PHP to System PATH..." -ForegroundColor Green
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
    if ($currentPath -notlike "*C:\php*") {
        try {
            [Environment]::SetEnvironmentVariable("Path", $currentPath + ";C:\php", [EnvironmentVariableTarget]::Machine)
            Write-Host "✅ Added C:\php to PATH" -ForegroundColor Green
            Write-Host "⚠️  Please close and reopen PowerShell for PATH changes to take effect!" -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Failed to update PATH. You may need to run as Administrator." -ForegroundColor Red
            Write-Host "Manual step: Add C:\php to System PATH in Environment Variables" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ C:\php already in PATH" -ForegroundColor Green
    }
    
    # Update current session PATH
    $env:Path += ";C:\php"
    
    # Step 5: Verify PHP
    Write-Host ""
    Write-Host "Step 5: Verifying PHP installation..." -ForegroundColor Green
    
    try {
        $phpVersion = & C:\php\php.exe --version 2>&1 | Select-Object -First 1
        Write-Host "✅ $phpVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ PHP verification failed: $_" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ PHP ZIP file not found in Downloads folder!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download PHP 8.3 Windows binary:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://windows.php.net/download/" -ForegroundColor Yellow
    Write-Host "2. Download: PHP 8.3.x VS16 x64 Thread Safe (ZIP)" -ForegroundColor Yellow
    Write-Host "3. Save to your Downloads folder" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    
    # Open download page
    Start-Process "https://windows.php.net/download/"
    exit 1
}

# Step 6: Install Composer
Write-Host ""
Write-Host "Step 6: Installing Composer..." -ForegroundColor Green

$composerSetup = "E:\MACRO\requirements\Composer-Setup.exe"

if (Test-Path $composerSetup) {
    Write-Host "✅ Found Composer installer" -ForegroundColor Green
    Write-Host "🚀 Launching Composer installer..." -ForegroundColor Cyan
    Write-Host "   Follow the installer prompts (it should auto-detect PHP)" -ForegroundColor Cyan
    Start-Process -FilePath $composerSetup -Wait
    Write-Host "✅ Composer installation completed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Composer installer not found at: $composerSetup" -ForegroundColor Yellow
}

# Final verification
Write-Host ""
Write-Host "=== Final Verification ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking PHP..." -ForegroundColor Yellow
& php --version 2>&1 | Select-Object -First 1

Write-Host ""
Write-Host "Checking Composer..." -ForegroundColor Yellow
& composer --version 2>&1 | Select-Object -First 1

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Close this PowerShell window" -ForegroundColor Green
Write-Host "2. Open a NEW PowerShell window (for PATH updates)" -ForegroundColor Green
Write-Host "3. Run: cd E:\MACRO\backend" -ForegroundColor Green
Write-Host "4. Run: composer install" -ForegroundColor Green
Write-Host "5. Run: php artisan key:generate" -ForegroundColor Green
Write-Host "6. Create database in MySQL Workbench: CREATE DATABASE macro_solutions;" -ForegroundColor Green
Write-Host "7. Update backend\.env with MySQL password: DB_PASSWORD=admin" -ForegroundColor Green
Write-Host "8. Run: php artisan migrate:fresh --seed" -ForegroundColor Green
Write-Host "9. Run: php artisan serve" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Installation script completed!" -ForegroundColor Green
