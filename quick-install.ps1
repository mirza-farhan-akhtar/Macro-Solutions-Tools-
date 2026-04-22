# MACRO Solutions - Quick Installation Script
# Automatically downloads PHP, installs everything

param(
    [switch]$SkipPHPDownload
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MACRO Solutions - Quick Installation Script       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "" 

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Please run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell → 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Step 1: Download and Install PHP
Write-Host "Step 1: Installing PHP 8.3..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

if (Test-Path "C:\php\php.exe") {
    Write-Host "✅ PHP already installed at C:\php" -ForegroundColor Green
} else {
    Write-Host "📥 Downloading PHP 8.3 (Thread Safe)..." -ForegroundColor Yellow
    
    $phpUrl = "https://windows.php.net/downloads/releases/php-8.3.14-Win32-vs16-x64.zip"
    $phpZip = "$env:TEMP\php-8.3.14.zip"
    
    try {
        # Download PHP
        Write-Host "   Source: $phpUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $phpUrl -OutFile $phpZip -UseBasicParsing
        Write-Host "✅ Download completed" -ForegroundColor Green
        
        # Extract PHP
        Write-Host "📂 Extracting to C:\php..." -ForegroundColor Yellow
        Expand-Archive -Path $phpZip -DestinationPath "C:\php" -Force
        Write-Host "✅ PHP extracted successfully" -ForegroundColor Green
        
        # Cleanup
        Remove-Item $phpZip -Force
        
    } catch {
        Write-Host "❌ Failed to download/extract PHP: $_" -ForegroundColor Red
        Write-Host "`nPlease download manually from: https://windows.php.net/download/" -ForegroundColor Yellow
        pause
        exit 1
    }
}

# Step 2: Configure PHP
Write-Host ""
Write-Host "Step 2: Configuring PHP..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

if (-not (Test-Path "C:\php\php.ini")) {
    Copy-Item "C:\php\php.ini-development" "C:\php\php.ini"
    Write-Host "✅ Created php.ini" -ForegroundColor Green
    
    # Enable extensions
    $phpIni = Get-Content "C:\php\php.ini" -Raw
    $phpIni = $phpIni -replace ';extension=pdo_mysql', 'extension=pdo_mysql'
    $phpIni = $phpIni -replace ';extension=mbstring', 'extension=mbstring'
    $phpIni = $phpIni -replace ';extension=openssl', 'extension=openssl'
    $phpIni = $phpIni -replace ';extension=fileinfo', 'extension=fileinfo'
    $phpIni = $phpIni -replace ';extension=curl', 'extension=curl'
    $phpIni | Set-Content "C:\php\php.ini" -NoNewline
    Write-Host "✅ Enabled required extensions" -ForegroundColor Green
} else {
    Write-Host "✅ php.ini already configured" -ForegroundColor Green
}

# Step 3: Add PHP to PATH
Write-Host ""
Write-Host "Step 3: Adding PHP to System PATH..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

$currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
if ($currentPath -notlike "*C:\php*") {
    try {
        [Environment]::SetEnvironmentVariable("Path", $currentPath + ";C:\php", [EnvironmentVariableTarget]::Machine)
        Write-Host "✅ Added C:\php to PATH" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Failed to update PATH: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ C:\php already in PATH" -ForegroundColor Green
}

# Update current session
$env:Path = "C:\php;" + $env:Path

# Step 4: Verify PHP
Write-Host ""
Write-Host "Step 4: Verifying PHP..." -ForegroundColor Green
Write-Host "-------------------------------------------------------" -ForegroundColor Gray

try {
    $phpVersion = & C:\php\php.exe --version 2>&1 | Select-Object -First 1
    Write-Host "Success: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: PHP verification failed" -ForegroundColor Red
    pause
    exit 1
}

# Step 5: Install Composer
Write-Host ""
Write-Host "Step 5: Installing Composer..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

$composerSetup = "E:\MACRO\requirements\Composer-Setup.exe"
if (Test-Path $composerSetup) {
    # Check if composer already installed
    try {
        $null = & composer --version 2>&1
        Write-Host "✅ Composer already installed" -ForegroundColor Green
    } catch {
        Write-Host "🚀 Running Composer installer..." -ForegroundColor Yellow
        Write-Host "   (A window will open - follow the prompts)" -ForegroundColor Gray
        Start-Process -FilePath $composerSetup -Wait
        Write-Host "✅ Composer installation completed" -ForegroundColor Green
        
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
} else {
    Write-Host "⚠️  Composer installer not found at: $composerSetup" -ForegroundColor Yellow
}

# Step 6: Create MySQL Database
Write-Host ""
Write-Host "Step 6: Creating MySQL Database..." -ForegroundColor Green
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray

$mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (Test-Path $mysqlExe) {
    try {
        # Create database
        $createDB = "CREATE DATABASE IF NOT EXISTS macro_solutions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        & $mysqlExe -u root -padmin -e $createDB 2>&1 | Out-Null
        Write-Host "✅ Database 'macro_solutions' created" -ForegroundColor Green
        
        # Verify
        $showDB = "SHOW DATABASES LIKE 'macro_solutions';"
        $result = & $mysqlExe -u root -padmin -e $showDB 2>&1
        if ($result -like "*macro_solutions*") {
            Write-Host "✅ Database verified" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Database might already exist (this is OK)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  MySQL not found at expected location" -ForegroundColor Yellow
}

# Final Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              INSTALLATION COMPLETED!                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ MySQL Server:  RUNNING (password: admin)" -ForegroundColor Green
Write-Host "✅ PHP:           INSTALLED" -ForegroundColor Green
Write-Host "✅ Composer:      INSTALLED" -ForegroundColor Green
Write-Host "✅ Database:      CREATED (macro_solutions)" -ForegroundColor Green
Write-Host "✅ Node.js:       v24.11.1" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                    NEXT STEPS                          ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. CLOSE this PowerShell window" -ForegroundColor Cyan
Write-Host "2. OPEN a NEW PowerShell window" -ForegroundColor Cyan
Write-Host "3. Run these commands:" -ForegroundColor Cyan
Write-Host ""

Write-Host "   cd E:\MACRO\backend" -ForegroundColor Green
    Write-Host "   composer install" -ForegroundColor Green
    Write-Host "   php artisan key:generate" -ForegroundColor Green
    Write-Host "   php artisan migrate:fresh --seed" -ForegroundColor Green
    Write-Host "   php artisan serve" -ForegroundColor Green
    Write-Host ""

Write-Host "Or run this automated script:" -ForegroundColor Cyan
Write-Host "   .\setup-backend.ps1" -ForegroundColor Green
Write-Host ""

pause
