# SIMPLE 3-STEP INSTALLATION GUIDE

## Current Status:
✅ MySQL: INSTALLED (Running, password: admin)
✅ Node.js: INSTALLED (v24.11.1)  
❌ PHP: NOT INSTALLED
❌ Composer: NOT INSTALLED (needs PHP first)

## What You Need To Do:

### STEP 1: Install PHP (5 minutes)

**Option A: Download Pre-compiled Binary (EASIEST)**

1. Open this link in your browser:
   https://windows.php.net/downloads/releases/php-8.3.14-Win32-vs16-x64.zip

2. Wait for download to complete (file size: ~31 MB)

3. Open PowerShell AS ADMINISTRATOR:
   - Press Win + X
   - Select "Windows PowerShell (Admin)"

4. Run these commands one by one:

```powershell
# Create PHP directory
New-Item -ItemType Directory -Path "C:\php" -Force

# Extract (replace USERNAME with your actual username)
Expand-Archive -Path "$env:USERPROFILE\Downloads\php-8.3.14-Win32-vs16-x64.zip" -DestinationPath "C:\php" -Force

# Configure PHP
Copy-Item "C:\php\php.ini-development" "C:\php\php.ini"

# Enable extensions
$ini = Get-Content "C:\php\php.ini" -Raw
$ini = $ini -replace ';extension=pdo_mysql', 'extension=pdo_mysql'
$ini = $ini -replace ';extension=mbstring', 'extension=mbstring'
$ini = $ini -replace ';extension=openssl', 'extension=openssl'
$ini = $ini -replace ';extension=fileinfo', 'extension=fileinfo'
$ini = $ini -replace ';extension=curl', 'extension=curl'
$ini | Set-Content "C:\php\php.ini" -NoNewline

# Add to PATH 
$path = [Environment]::GetEnvironmentVariable("Path", "Machine")
[Environment]::SetEnvironmentVariable("Path", "$path;C:\php", "Machine")

# Verify
& C:\php\php.exe --version
```

**You should see:** `PHP 8.3.14 (cli) ...`

---

### STEP 2: Install Composer (2 minutes)

1. Double-click this file:
   **E:\MACRO\requirements\Composer-Setup.exe**

2. Follow the installer:
   - It will ask for PHP location: **C:\php\php.exe**
   - Click "Next" through all screens
   - Click "Finish"

3. Close PowerShell and open a NEW one

4. Verify:
```powershell
composer --version
```

**You should see:** `Composer version 2.x.x`

---

### STEP 3: Setup Backend (5 minutes)

1. Create the database - Run this command:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p admin -e "CREATE DATABASE IF NOT EXISTS macro_solutions;"
```

2. Navigate to backend and install dependencies:

```powershell
cd E:\MACRO\backend
composer install
```

**Wait 2-3 minutes** for 80+ packages to install...

3. Generate encryption key:

```powershell
php artisan key:generate
```

4. Run database migrations:

```powershell
php artisan migrate:fresh --seed
```

This creates all tables and sample data!

5. Start the backend server:

```powershell
php artisan serve
```

**You should see:**
```
INFO  Server running on [http://127.0.0.1:8000].
```

**KEEP THIS TERMINAL OPEN!**

---

## STEP 4: Test the Application

1. **Frontend is already running:** http://localhost:3000
2. **Backend is now running:** http://localhost:8000  

3. **Login to admin panel:**
   - Go to: http://localhost:3000/login
   - Email: **admin@macro.com**
   - Password: **password**

4. **You should see:**
   - Beautiful glassmorphism design
   - Dashboard with 4 charts
   - Real data from database

---

## Quick Reference

### Default Passwords
- MySQL: `admin` (root user)
- Admin User: `admin@macro.com` / `password`
- Regular User: `user@macro.com` / `password`

### Server Commands

**Start Frontend:**
```powershell
cd E:\MACRO\frontend
npm run dev
```

**Start Backend:**
```powershell
cd E:\MACRO\backend
php artisan serve
```

**Reset Database:**
```powershell
php artisan migrate:fresh --seed
```

---

## If You Get Stuck

### "php: command not found"
- Close ALL PowerShell windows
- Open a NEW PowerShell
- PATH changes need a restart

### "Composer not found"
- Same as above - close and reopen PowerShell

### "Database connection error"
- Check MySQL is running:
  ```powershell
  Get-Service MySQL80
  ```
- Should show "Running"

### "Port 8000 already in use"
```powershell
php artisan serve --port=8080
# Then update frontend\.env: VITE_API_URL=http://localhost:8080/api
```

---

## FASTEST WAY (If you have admin rights):

1. Right-click PowerShell → "Run as Administrator"
2. Run:
   ```powershell
   cd E:\MACRO
   .\install-all.ps1
   ```
3. Wait for it to download PHP and configure everything
4. When done, close PowerShell and open NEW one
5. Run:
   ```powershell
   cd E:\MACRO  
   .\setup-backend.ps1
   ```
6. Done!

---

That's it! The application will be fully functional with:
- ✅ Beautiful liquid glass design
- ✅ Working authentication
- ✅ Admin dashboard with live charts
- ✅ Database with sample data
- ✅ All CRUD operations working
