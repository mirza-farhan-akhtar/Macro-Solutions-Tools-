# 📦 COMPLETE INSTALLATION GUIDE

## 🎉 FRONTEND IS ALREADY RUNNING!

**Your React app is live at: http://localhost:3000**

Open it now to see the beautiful liquid glass design in action!

---

## 🛠️ BACKEND SETUP (Required for Full Functionality)

Follow these steps to get the backend API running:

### Step 1: Install PHP 8.2+ (Windows)

1. **Download PHP**:
   - Go to: https://windows.php.net/download/
   - Download **PHP 8.2 or 8.3** (Thread Safe, x64)
   - Example: `php-8.3.15-Win32-vs16-x64.zip`

2. **Extract PHP**:
   ```powershell
   # Extract to C:\php
   # Your directory should look like this:
   # C:\php\php.exe
   # C:\php\php.ini-development
   ```

3. **Add PHP to PATH**:
   - Open **System Properties** → **Environment Variables**
   - Under **System Variables**, find **Path**
   - Click **Edit** → **New**
   - Add: `C:\php`
   - Click **OK** to save

4. **Configure PHP**:
   ```powershell
   # Copy php.ini-development to php.ini
   cd C:\php
   copy php.ini-development php.ini
   
   # Open php.ini and enable these extensions (remove semicolon):
   # extension=pdo_mysql
   # extension=mbstring
   # extension=openssl
   # extension=fileinfo
   ```

5. **Verify Installation**:
   ```powershell
   php --version
   # Should show: PHP 8.2.x or 8.3.x
   ```

### Step 2: Install Composer

1. **Download Composer**:
   - Go to: https://getcomposer.org/download/
   - Download **Composer-Setup.exe** (Windows Installer)

2. **Run Installer**:
   - During installation, it will auto-detect your PHP installation at `C:\php\php.exe`
   - Follow the wizard, accept defaults
   - Installer will add Composer to PATH automatically

3. **Verify Installation**:
   ```powershell
   composer --version
   # Should show: Composer version 2.x.x
   ```

### Step 3: Install MySQL 8.0+

1. **Download MySQL**:
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download **MySQL Installer for Windows** (mysql-installer-community-8.x.x.msi)

2. **Run Installer**:
   - Choose **Custom** installation
   - Select these products:
     - MySQL Server 8.0.x
     - MySQL Workbench (optional, for GUI)
   - Click **Next** through the wizard

3. **Configure MySQL Server**:
   - Type: **Development Computer**
   - Authentication: **Use Strong Password Encryption**
   - Set **root password**: (remember this!)
   - Click **Execute** to apply configuration

4. **Verify Installation**:
   ```powershell
   # MySQL should be running as a Windows service
   # Check in Services (services.msc) for "MySQL80"
   ```

### Step 4: Setup Laravel Backend

Open PowerShell in project directory:

```powershell
# Navigate to backend folder
cd E:\MACRO\backend

# Install Composer dependencies (this might take 2-3 minutes)
composer install

# Expected output: Installing 80+ packages
# Wait for: "Generating optimized autoload files"
```

### Step 5: Configure Environment

```powershell
# Generate application encryption key
php artisan key:generate

# Expected output:
# Application key set successfully.
```

Check `.env` file (it's already configured, but verify):
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=macro_solutions
DB_USERNAME=root
DB_PASSWORD=          # ← PUT YOUR MYSQL ROOT PASSWORD HERE IF YOU SET ONE
```

### Step 6: Create Database

**Option A: Using MySQL Command Line**
```powershell
# Connect to MySQL
mysql -u root -p
# Enter your root password when prompted

# Create database
CREATE DATABASE macro_solutions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;

# Exit MySQL
exit;
```

**Option B: Using MySQL Workbench (if installed)**
1. Open MySQL Workbench
2. Connect to Local instance
3. Click "Create new schema" button
4. Name: `macro_solutions`
5. Charset: `utf8mb4`
6. Click **Apply**

### Step 7: Run Migrations & Seed Data

```powershell
cd E:\MACRO\backend

# Run all migrations and seed sample data
php artisan migrate:fresh --seed

# Expected output:
# Dropping all tables ....................................... DONE
# Creating migration table .................................. DONE
# Running migrations ......................................... DONE
# Seeding database .......................................... DONE
```

This creates:
- ✅ 15 database tables
- ✅ Admin user (admin@macro.com / password)
- ✅ Regular user (user@macro.com / password)
- ✅ 6 Services with full content
- ✅ 4 AI Services
- ✅ 3 Blog posts with views
- ✅ 4 FAQs
- ✅ 4 Team members
- ✅ 2 Job openings
- ✅ 2 Sample leads
- ✅ 1 About page
- ✅ Site settings

### Step 8: Start Laravel Server

```powershell
cd E:\MACRO\backend

# Start development server
php artisan serve

# Expected output:
#   INFO  Server running on [http://127.0.0.1:8000].
#
#   Press Ctrl+C to stop the server
```

**IMPORTANT**: Keep this terminal open! The server must stay running.

### Step 9: Test Backend API

Open a new PowerShell window:

```powershell
# Test public endpoint
curl http://localhost:8000/api/public/home

# Should return JSON data with services, blogs, team, etc.
```

Or open in browser:
- http://localhost:8000/api - API info page

---

## 🎯 USING THE APPLICATION

### Access Points:

1. **Public Website**: http://localhost:3000
   - Home page with hero section
   - Services listing
   - Blog posts
   - Contact form
   - Team members
   - Careers

2. **Admin Panel**: http://localhost:3000/admin
   - Redirects to login if not authenticated

3. **Login Page**: http://localhost:3000/login
   - Use credentials:
     - Email: `admin@macro.com`
     - Password: `password`

### After Login (Admin):

1. **Dashboard** (http://localhost:3000/admin)
   - 4 statistics cards with real data
   - 4 interactive charts (Line, Bar, Area, Bar)
   - Latest activity feeds

2. **Users Management** (http://localhost:3000/admin/users)
   - Full CRUD implementation
   - Search by name/email
   - Filter by role
   - Create/Edit modal
   - Delete with confirmation

3. **Other Admin Pages** (placeholders, ready for implementation):
   - Services, AI Services
   - Blogs, FAQs
   - Team Members
   - Careers, Applications
   - Leads (CRM)
   - Appointments
   - Pages (CMS)
   - Settings

### Public Website Features:

1. **Homepage** - Fully functional
   - Hero with gradient blobs
   - Features grid
   - Services showcase (loads from DB)
   - Call-to-action section

2. **Services Page** - Fully functional
   - Grid of all services from database
   - Click any service → Service Detail page

3. **Service Detail** - Fully functional
   - Full service description
   - Rich HTML content
   - CTA sections

4. **Blog Page** - Fully functional
   - All blog posts
   - Category filtering
   - Views counter
   - Published date

5. **Contact Page** - Fully functional
   - Contact form
   - Creates lead in database
   - Toast notification on success

---

## 🐛 TROUBLESHOOTING

### "composer: command not found"
**Solution**: Composer not installed or not in PATH
- Re-run Composer installer
- Or manually add `C:\ProgramData\ComposerSetup\bin` to PATH

### "php: command not found"
**Solution**: PHP not in PATH
- Add `C:\php` to System Environment Variables → Path

### "SQLSTATE[HY000] [2002] No connection could be made"
**Solution**: MySQL not running or wrong credentials
- Check MySQL service is running (services.msc → MySQL80)
- Verify .env has correct DB_PASSWORD
- Check MySQL is on port 3306

### "Class 'Illuminate\...' not found"
**Solution**: Composer dependencies not installed
```powershell
cd E:\MACRO\backend
composer install
composer dump-autoload
```

### "Migration table not found"
**Solution**: Migrations not run
```powershell
php artisan migrate:fresh --seed
```

### "419 Page Expired" on form submission
**Solution**: CSRF token mismatch
- Backend is using API routes (no CSRF needed)
- Check frontend .env has correct VITE_API_URL=http://localhost:8000/api

### Frontend shows blank page
**Solution**: Check browser console for errors
- Ensure both servers are running:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:8000
- Check .env files are correct

### API returns 401 Unauthorized
**Solution**: Token expired or not sent
- Logout and login again
- Check localStorage has 'auth_token'
- Check axios interceptor is adding Authorization header

### Charts not showing data
**Solution**: Backend not running or not seeded
- Ensure `php artisan serve` is running
- Run `php artisan migrate:fresh --seed` to add sample data
- Refresh the page

---

## ✅ VERIFICATION CHECKLIST

After completing all steps, verify:

- [ ] Frontend running on http://localhost:3000
- [ ] Backend running on http://localhost:8000
- [ ] Can access homepage with services displayed
- [ ] Can navigate to Services page → see 6 services
- [ ] Can navigate to Blog page → see 3 blog posts
- [ ] Can submit contact form → see success toast
- [ ] Can access /login page
- [ ] Can login with admin@macro.com / password
- [ ] Admin dashboard shows 4 charts with data
- [ ] Statistics cards show numbers (not 0)
- [ ] Users page shows 2 users
- [ ] Can create new user from admin panel
- [ ] Can search users by name
- [ ] Can filter users by role
- [ ] Can edit user
- [ ] Activity feed shows latest leads/applications

---

## 🎓 DEFAULT CREDENTIALS

### Admin Account
- **Email**: admin@macro.com
- **Password**: password
- **Role**: admin
- **Access**: Full admin panel access

### Regular User Account
- **Email**: user@macro.com
- **Password**: password
- **Role**: user
- **Access**: Not allowed in admin panel

### Database
- **Name**: macro_solutions
- **User**: root
- **Password**: (your MySQL root password)
- **Host**: 127.0.0.1
- **Port**: 3306

---

## 📊 BACKEND SERVER COMMANDS

```powershell
# Start server (blocks terminal)
php artisan serve

# Run on different port
php artisan serve --port=8080

# Make accessible on network
php artisan serve --host=0.0.0.0

# Run migrations
php artisan migrate

# Reset database and migrate
php artisan migrate:fresh

# Reset and seed
php artisan migrate:fresh --seed

# Only seed (without migration)
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Generate new app key
php artisan key:generate

# View routes
php artisan route:list

# Create new migration
php artisan make:migration create_tablename_table

# Create new model
php artisan make:model ModelName

# Create new controller
php artisan make:controller ControllerName

# Run tests (if created)
php artisan test
```

---

## 🚀 PRODUCTION DEPLOYMENT (Future)

When ready to deploy:

1. **Frontend**:
   ```powershell
   cd frontend
   npm run build
   # Deploy 'dist' folder to static hosting (Vercel, Netlify, etc.)
   ```

2. **Backend**:
   - Deploy to PHP hosting (Cloudways, Forge, Heroku)
   - Set environment to production in .env
   - Update CORS and Sanctum for production domains
   - Use production database (not local MySQL)
   - Set up SSL certificate

3. **Environment Variables**:
   - Update frontend `.env` with production API URL
   - Update backend `.env` with production database and domain

---

## 📚 ADDITIONAL RESOURCES

- **Laravel Documentation**: https://laravel.com/docs/11.x
- **React Documentation**: https://react.dev
- **Tailwind CSS v4**: https://tailwindcss.com
- **Vite**: https://vite.dev
- **Recharts**: https://recharts.org
- **Framer Motion**: https://www.framer.com/motion
- **Laravel Sanctum**: https://laravel.com/docs/11.x/sanctum

---

**🎉 You're all set! Enjoy building with MACRO Solutions!**

If you encounter any issues not covered here, check:
1. Laravel logs: `backend/storage/logs/laravel.log`
2. Browser console (F12)
3. Terminal output for error messages
