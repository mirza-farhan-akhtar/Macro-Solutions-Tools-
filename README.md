# MACRO Solutions Tools Ltd
## Enterprise SaaS Platform with Liquid Glass Design

A complete full-stack application featuring a dynamic public website and admin panel, built with Laravel 11 REST API and React 18 SPA, showcasing iOS-style glassmorphism design throughout.

## 🏆 Project Features

### Design System
- **Liquid Glass / iOS-Style Glassmorphism** on every screen
- Frosted glass cards with backdrop blur
- Floating layers with depth and shadows
- Smooth transitions and animations (Framer Motion)
- Gradient blobs and modern aesthetics
- Inter font family (Apple-like typography)

### Backend (Laravel 11)
- RESTful API architecture
- Laravel Sanctum authentication
- 12+ database tables with relationships
- Auto-slugs generation
- Published/Draft content system
- Form validation with Request classes
- Database seeding with sample data
- Admin middleware for protected routes

### Frontend (React 18 + Vite)
- Glass design system with Tailwind CSS 4
- Framer Motion animations
- Recharts for interactive charts
- React Router DOM for SPA routing
- Protected admin routes
- Responsive design (mobile-first)
- Hot toast notifications

### Content Management
- **Public Website**: Home, About, Services, AI Services, Blogs, FAQs, Team, Careers, Contact
- **Admin Dashboard**: Statistics, Charts (Line, Bar, Area), Recent Activity
- **Admin CRUD**: Users, Services, AI Services, Blogs, FAQs, Team, Careers, Applications, Leads, Appointments, Pages, Settings

## 📋 Requirements

### Backend
- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **MySQL**: 8.0 or higher

###Frontend
- **Node.js**: 18+ or 20+
- **npm**: Latest version

## 🚀 Installation Guide

### Step 1: Install PHP and Composer

#### Windows:
1. Download **PHP 8.2+** from https://windows.php.net/download/
2. Extract to `C:\php` and add to PATH
3. Download **Composer** from https://getcomposer.org/download/
4. Install MySQL from https://dev.mysql.com/downloads/installer/

### Step 2: Setup Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Generate application key
php artisan key:generate

# Create MySQL database
# Open MySQL and run: CREATE DATABASE macro_solutions;

# Update .env file if needed (database credentials)
# DB_DATABASE=macro_solutions
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed database
php artisan migrate:fresh --seed

# Start Laravel development server
php artisan serve
```

Backend will run on: http://localhost:8000

### Step 3: Setup Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run on: http://localhost:3000

### Step 4: Access the Application

- **Public Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Admin Login**: 
  - Email: admin@macro.com
  - Password: password

## 📁 Project Structure

```
MACRO/
├── backend/               # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API Controllers
│   │   │   └── Middleware/       # Admin Middleware
│   │   └── Models/               # Eloquent Models
│   ├── database/
│   │   ├── migrations/           # Database schema
│   │   └── seeders/              # Sample data
│   ├── routes/
│   │   └── api.php              # API routes
│   └── .env                      # Environment config
│
├── frontend/              # React 18 + Vite
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/             # Auth context
│   │   ├── layouts/             # Public/Admin layouts
│   │   ├── pages/
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── auth/           # Login/Signup
│   │   │   └── public/         # Public pages
│   │   ├── services/           # API service
│   │   ├── App.jsx             # Main app with routes
│   │   ├── index.css           # Glass design system
│   │   └── main.jsx            # Entry point
│   ├── .env                     # Frontend config
│   └── tailwind.config.js       # Tailwind CSS 4
│
└── instructions.md        # Design specifications
```

## 🎨 Design System Classes

### Glass Components
```css
.glass-card              /* Frosted glass card */
.glass-card-hover        /* Glass card with hover effect */
.glass-header            /* Glass header/navbar */
.glass-sidebar           /* Glass sidebar */
.glass-footer            /* Glass footer */
.glass-input             /* Glass form input */
.glass-button            /* Glass button */
.glass-table-row         /* Glass table row */
.glass-modal-overlay     /* Glass modal backdrop */
.gradient-blob           /* Animated gradient blob */
```

### Color Tokens
```css
--primary: #2563EB      /* Blue */
--accent: #06B6D4       /* Cyan */
--accent-purple: #7C3AED /* Purple */
```

## 🔌 API Endpoints

### Public Routes
- `GET /api/public/home` - Homepage data
- `GET /api/public/services` - All services
- `GET /api/public/blogs` - Blog posts
- `POST /api/public/contact` - Contact form
- `POST /api/public/apply` - Job application

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Admin (Requires Auth + Admin Role)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/charts` - Chart data
- `GET /api/admin/users` - Users CRUD
- `GET /api/admin/services` - Services CRUD
- `GET /api/admin/blogs` - Blogs CRUD
- `GET /api/admin/faqs` - FAQs CRUD
- `GET /api/admin/team` - Team CRUD
- `GET /api/admin/careers` - Careers CRUD
- `GET /api/admin/applications` - Applications management
- `GET /api/admin/leads` - Leads management
- `GET /api/admin/appointments` - Appointments
- `GET /api/admin/pages` - Pages CMS
- `GET /api/admin/settings` - Settings

## 🧪 Testing

```bash
# Backend tests (once PHP dependencies installed)
cd backend
php artisan test

# Frontend dev server
cd frontend
npm run dev

# Production build
npm run build
npm run preview
```

## 🛠️ Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Create API endpoint in backend
4. Use glass design classes

### Database Changes
```bash
# Create migration
php artisan make:migration create_table_name

# Run migration
php artisan migrate

# Reset and reseed
php artisan migrate:fresh --seed
```

## 📱 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Default Credentials

**Admin Account**:
- Email: admin@macro.com
- Password: password

**Regular User**:
- Email: user@macro.com
- Password: password

## 📄 License

Proprietary - MACRO Solutions Tools Ltd © 2026

## 🆘 Troubleshooting

### Backend Issues
- **"composer not found"**: Install Composer from getcomposer.org
- **"php not found"**: Add PHP to system PATH
- **Database connection failed**: Check MySQL is running, verify .env credentials
- **"Class not found"**: Run `composer dump-autoload`

### Frontend Issues
- **"Cannot find module"**: Run `npm install`
- **API errors**: Ensure backend is running on port 8000
- **Styles not loading**: Check Tailwind CSS is configured
- **Port 5173 in use**: Change port in vite.config.js

### Design Issues
- **No glass effect**: Ensure browser supports backdrop-filter
- **Animations not working**: Check Framer Motion is installed
- **Charts not rendering**: Verify Recharts dependency

## 🎯 Next Steps

1. Install PHP, Composer, MySQL, and Node.js
2. Setup backend and run migrations
3. Install frontend dependencies
4. Start both servers
5. Login to admin panel
6. Customize content via CMS

---

**Built with ❤️ using Laravel 11 + React 18 + Liquid Glass Design**
