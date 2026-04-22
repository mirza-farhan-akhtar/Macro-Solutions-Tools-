# MACRO Solutions - Dual Role System Guide

## 🎯 Quick Reference

### Two-Level Security System

#### **Level 1: User Type (Admin/User)**
- **Purpose:** Controls admin panel access
- **User Type "User":** ❌ Cannot access `/admin` panel (public only)
- **User Type "Admin":** ✅ Can access `/admin` panel

#### **Level 2: RBAC Roles**
- **Purpose:** Controls what users see and do INSIDE the admin panel
- **Super Admin:** Full access (bypasses all permission checks)
- **HR Manager:** Careers, Applications, Team
- **Content Manager:** Services, AI Services, Blogs, FAQs, Pages, Team
- **CRM Manager:** Leads, Appointments
- **Finance Manager:** Finance modules
- **Viewer:** Read-only access

---

## 🔑 Key Concepts

### User Type vs RBAC Roles

| User Type | RBAC Role | Result |
|-----------|-----------|---------|
| User | None | ❌ No admin panel access |
| User | Any Role | ❌ No admin panel access |
| Admin | None | ⚠️ Panel access, no menus |
| Admin | HR Manager | ✅ HR menus only |
| Admin | Content Manager | ✅ Content menus only |
| Admin | Super Admin | ✅ ALL menus (full access) |

### Analogy
- **User Type (Admin/User)** = 🚪 Door to building
- **RBAC Roles** = 🔑 Keys to specific rooms

You need the **door** (Admin type) to enter, then **keys** (RBAC roles) to access specific rooms!

---

## 📊 Menu Visibility by Role

### Super Admin
**Sees:** Everything (15 modules)
- ✅ Dashboard, Users, Roles, Permissions
- ✅ Services, AI Services, Blogs, FAQs, Team, Pages
- ✅ Careers, Applications, Leads, Appointments, Settings

### HR Manager
**Sees:** HR-related modules only
- ✅ Dashboard
- ✅ Careers (full CRUD)
- ✅ Applications (view/edit/delete)
- ✅ Team (if has permission)
- ❌ Services, Blogs, FAQs, Pages
- ❌ Users, Roles, Permissions, Settings
- ❌ Leads, Appointments

### Content Manager
**Sees:** Content modules only
- ✅ Dashboard
- ✅ Services, AI Services
- ✅ Blogs, FAQs, Team, Pages
- ❌ Users, Roles, Permissions
- ❌ Careers, Applications
- ❌ Leads, Appointments, Settings

### CRM Manager
**Sees:** CRM modules only
- ✅ Dashboard
- ✅ Leads
- ✅ Appointments
- ❌ All other modules

---

## 🧪 Testing Instructions

### Step 1: Login as Super Admin
```
Email: admin@macro.com
Password: password
Result: Should see ALL 15 menu items
```

### Step 2: Create HR Manager User
1. Go to **Users** > **Add User**
2. Fill in:
   - Name: HR Manager Test
   - Email: hr@macro.com
   - **User Type: ADMIN** (important!)
   - **RBAC Roles:** ✓ HR Manager
   - Password: password123
3. Click **Create**

### Step 3: Test HR Manager Access
1. Logout
2. Login: hr@macro.com / password123
3. **Expected:** See only Dashboard, Careers, Applications, Team
4. **Should NOT see:** Services, Blogs, Users, Roles, Settings, etc.

---

## 🔒 Security Features

### Frontend Filtering
- Menu items filtered based on permissions
- Instant UX (no loading)
- Clean interface (only see what you can use)

### Backend Validation
- Every API call validates permissions
- Cannot bypass by URL manipulation
- Double security layer

### Permission System
- **62 total permissions** across 15 modules
- **Granular actions:** View, Create, Edit, Delete
- **Example permissions:**
  - `blogs.view` - View blog list
  - `blogs.create` - Create new blogs
  - `users.edit` - Edit users
  - `careers.delete` - Delete careers

---

## 📝 Creating Custom Roles

1. Go to **Roles** page
2. Click **Add Role**
3. Enter role name and description
4. **Select permissions** using checkboxes (grouped by module)
5. Each module shows: View, Create, Edit, Delete options
6. Click **Create**

### Permission Selection Tips
- **View:** Required to see the module in menu
- **Create:** Add new records
- **Edit:** Modify existing records
- **Delete:** Remove records

---

## ⚡ Quick Actions

### Give user full HR access
```
User Type: Admin
RBAC Roles: ✓ HR Manager
Permissions: careers.*, applications.*, team.*
```

### Give user read-only access
```
User Type: Admin
RBAC Roles: ✓ Viewer
Permissions: *.view only
```

### Give user blog editing only
```
User Type: Admin
RBAC Roles: ✓ Content Manager
Then edit Content Manager role to have only:
- blogs.view
- blogs.create
- blogs.edit
```

---

## 🎨 Color Coding in UI

### Permission Badges
- 🟢 **View** (Green) - Read access
- 🔵 **Create** (Blue) - Add new
- 🟡 **Edit** (Yellow) - Modify
- 🔴 **Delete** (Red) - Remove

### User Type Badges
- 🟣 **Admin** (Purple) - Panel access user
- ⚪ **User** (Gray) - Regular user

---

## 🚨 Common Scenarios

### "User can access panel but sees empty menu"
**Cause:** User Type = Admin, but no RBAC roles assigned  
**Solution:** Assign appropriate RBAC role(s)

### "HR Manager sees all menus"
**Cause:** Old bug (now fixed!)  
**Solution:** Already resolved - menu now filters correctly

### "User gets 403 Forbidden error"
**Cause:** User lacks required permission  
**Solution:** Assign proper RBAC role with needed permissions

### "Can't find a user in admin panel"
**Cause:** User Type = "User" (not "Admin")  
**Solution:** Change User Type to "Admin" to grant panel access

---

## 📞 Access URLs

- **Public Website:** http://localhost:3002
- **Admin Panel:** http://localhost:3002/admin
- **Backend API:** http://localhost:8000

---

## 🔐 Default Credentials

**Super Admin:**
- Email: admin@macro.com
- Password: password

---

**Last Updated:** February 12, 2026  
**Version:** 1.0
