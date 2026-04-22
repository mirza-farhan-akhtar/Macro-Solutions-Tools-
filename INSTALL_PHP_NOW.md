# PHP Installation Steps (REQUIRED)

## ⚠️ IMPORTANT: The php-8.5.1-src folder contains SOURCE CODE, not binaries!

You need pre-compiled PHP binaries for Windows.

## Step 1: Download PHP (If not already downloaded)

1. Go to: https://windows.php.net/download/
2. Download: **PHP 8.3.x VS16 x64 Thread Safe** (ZIP file)
   - Example: `php-8.3.14-Win32-vs16-x64.zip`
   - File size: ~30 MB

## Step 2: Extract PHP

```powershell
# After downloading, extract to C:\php
# Example if downloaded to Downloads folder:
Expand-Archive -Path "$env:USERPROFILE\Downloads\php-8.3.14-Win32-vs16-x64.zip" -DestinationPath "C:\php"
```

## Step 3: Configure PHP

```powershell
# Copy php.ini configuration
Copy-Item "C:\php\php.ini-development" "C:\php\php.ini"

# Enable required extensions (edit C:\php\php.ini)
# Uncomment these lines (remove the semicolon):
# extension=pdo_mysql
# extension=mbstring
# extension=openssl
# extension=fileinfo
# extension=curl
```

## Step 4: Add PHP to System PATH

**Option A: Using PowerShell (Administrator)**
```powershell
# Run PowerShell as Administrator, then:
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\php", [EnvironmentVariableTarget]::Machine)
```

**Option B: Using GUI**
1. Press `Win + X` → Select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit" → Click "New"
6. Add: `C:\php`
7. Click OK on all windows

## Step 5: Verify Installation

Close ALL PowerShell/Terminal windows, open a new one, then:

```powershell
php --version
```

Should show: `PHP 8.3.x`

## Step 6: Enable PHP Extensions

Edit `C:\php\php.ini` using Notepad:

```powershell
notepad C:\php\php.ini
```

Find and uncomment (remove `;` from start):
- `;extension=pdo_mysql` → `extension=pdo_mysql`
- `;extension=mbstring` → `extension=mbstring`
- `;extension=openssl` → `extension=openssl`
- `;extension=fileinfo` → `extension=fileinfo`
- `;extension=curl` → `extension=curl`

Save and close.

## ✅ After PHP is installed, we can install Composer and setup the backend!
