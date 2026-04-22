# 🚀 MACRO Solutions - Final Setup Checklist

## ✅ Completed So Far

- [x] MySQL Server 8.0.44 installed (password: admin)
- [x] MySQL password configured in backend/.env
- [x] Backend database configuration ready
- [x] Frontend running on http://localhost:3000
- [x] Installation scripts created

## 📋 Remaining Steps (In Order)

### Step 1: Download PHP (⏳ IN PROGRESS)

**From the browser tab I opened (https://windows.php.net/download/):**

1. Scroll down to **"PHP 8.3.14"** (or latest 8.3.x version)
2. Click **"VS16 x64 Thread Safe"** under "Zip" column
3. Save the ZIP file (~30 MB)
4. Wait for download to complete

**Download URL:** https://windows.php.net/download/#php-8.3

### Step 2: Install PHP & Composer

**Option A: Automated (Recommended)**

1. Open PowerShell as **Administrator**
   - Press `Win + X` → Select "Windows PowerShell (Admin)"

2. Run the installation script:
   ```powershell
   cd E:\MACRO
   Set-ExecutionPolicy Bypass -Scope Process -Force
   .\install-php-composer.ps1
   ```

3. The script will:
   - Extract PHP to C:\php
   - Configure php.ini
   - Add PHP to PATH
   - Install Composer
   - Verify everything


**Option B: Manual**

If automated script fails, follow: [INSTALL_PHP_NOW.md](INSTALL_PHP_NOW.md)

### Step 3: Create MySQL Database

**Option A: Using MySQL Command Line**

1. Open "MySQL 8.0 Command Line Client" from Start Menu
2. Enter password: `admin`
3. Run:
   ```sql
   CREATE DATABASE macro_solutions;
   exit;
   ```

**Option B: Using MySQL Workbench** (if installed)

1. Open MySQL Workbench
2. Connect to localhost (password: admin)
3. Click "SQL" tab
4. Copy contents from: `E:\MACRO\create-database.sql`
5. Execute

**Option C: Using PowerShell + MySQL CLI**

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -padmin -e "CREATE DATABASE macro_solutions;"
```

### Step 4: Setup Laravel Backend

**Close any PowerShell windows and open a NEW one** (for PATH updates), then:

```powershell
# Navigate to backend
cd E:\MACRO\backend

# Install Laravel dependencies (~2 minutes)
composer install

# Generate application key
php artisan key:generate

# Run database migrations and seed data (~30 seconds)
php artisan migrate:fresh --seed

# Start Laravel backend server
php artisan serve
```

**Expected Output:**
```
Server running on [http://127.0.0.1:8000]
```

⚠️ **Keep this terminal window open!**

### Step 5: Test Complete System

1. **Frontend:** http://localhost:3000 (already running)
2. **Backend:** http://localhost:8000 (from Step 4)

### Step 6: Login to Admin Dashboard

1. Go to: http://localhost:3000/login
2. Enter credentials:
   - **Email:** admin@macro.com
   - **Password:** password
3. Should redirect to Dashboard with 4 charts!

### Step 7: Verify Everything Works

- [ ] Homepage loads with services/blogs data
- [ ] Glass design renders beautifully (frosted cards, blur effects)
- [ ] Services page shows 6 services
- [ ] Blogs page shows 3 blog posts
- [ ] Contact form submits successfully
- [ ] Login works with admin credentials
- [ ] Dashboard shows 4 charts with live data
- [ ] Users page shows users list
- [ ] Logout works

---

## 🆘 Troubleshooting

### PHP not recognized after installation
- Close ALL PowerShell windows
- Open NEW PowerShell window
- PATH changes need new session

### Composer install fails
- Make sure PHP is installed and in PATH
- Run: `php --version` (should show PHP 8.3.x)
- Run: `composer --version` (should show Composer 2.x)

### Database migration fails
- Check MySQL is running:
  ```powershell
  Get-Service MySQL80
  ```
- Should show "Running"
- Check credentials in backend/.env:
  - DB_PASSWORD=admin

### Port 8000 already in use
```powershell
# Use different port
php artisan serve --port=8080

# Update frontend/.env
# Change VITE_API_URL=http://localhost:8080/api
```

### Still have errors?
Check the detailed logs:
- Backend: `E:\MACRO\backend\storage\logs\laravel.log`
- Frontend: Browser Console (F12)

---

## 📊 Current Status

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| Frontend (Vite + React) | ✅ Running | 3000 | http://localhost:3000 |
| Backend (Laravel) | ⏳ Pending | 8000 | http://localhost:8000 |
| MySQL Database | ✅ Installed | 3306 | localhost:3306 |
| PHP | ⏳ Download | - | - |
| Composer | ⏳ Pending | - | - |

---

## 🎯 Next Immediate Action

**👉 Download PHP ZIP from the browser tab, then run: `.\install-php-composer.ps1`**

---

## 📄 Reference Files

- **Installation Script:** `install-php-composer.ps1` (automated)
- **Manual PHP Guide:** `INSTALL_PHP_NOW.md`
- **Database SQL:** `create-database.sql`
- **Fixes Applied:** `FIXES_APPLIED.md`
- **Full Setup:** `FIX_INSTRUCTIONS.md`
