# MACRO Solutions - Backend API

Laravel 11 REST API for MACRO Solutions Tools Ltd.

## Requirements

- PHP 8.2 or higher
- Composer
- MySQL 8.0 or higher

## Setup Instructions

### 1. Install PHP and Composer

Download and install:
- **PHP**: https://windows.php.net/download/
- **Composer**: https://getcomposer.org/download/

### 2. Install Dependencies

```bash
cd backend
composer install
```

### 3. Configure Environment

The `.env` file is already configured. Update database credentials if needed:

```
DB_DATABASE=macro_solutions
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Create Database

Create a MySQL database named `macro_solutions`:

```sql
CREATE DATABASE macro_solutions;
```

### 6. Run Migrations and Seeders

```bash
php artisan migrate:fresh --seed
```

### 7. Start Development Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

## Admin Credentials

- **Email**: admin@macro.com
- **Password**: password

## API Documentation

### Public Endpoints

- `GET /api/public/home` - Homepage data
- `GET /api/public/services` - All services
- `GET /api/public/blogs` - All blogs
- `GET /api/public/faqs` - All FAQs
- `POST /api/public/contact` - Submit contact form

### Auth Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Admin Endpoints (Requires Authentication)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/charts` - Chart data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/services` - Manage services
- `GET /api/admin/blogs` - Manage blogs
- And more...

## Testing

```bash
php artisan test
```

## License

Proprietary - MACRO Solutions Tools Ltd
