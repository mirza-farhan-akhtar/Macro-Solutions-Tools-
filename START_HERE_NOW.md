# 🎯 QUICK REFERENCE - START HERE

## ⚡ 30 Second Startup

### **Terminal 1 (Backend)**
```powershell
cd e:\MACRO\backend
php artisan serve --host=127.0.0.1 --port=8000
```
👉 Keep this running

### **Terminal 2 (Frontend)**
```powershell
cd e:\MACRO\frontend
npm run dev
```

### **Then Open Browser**
👉 http://localhost:5173

---

## ✨ That's All You Need!

Both servers will now be running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000

Once you login to the admin panel, navigate to **CRM** in the sidebar.

---

## 📍 All CRM Pages

| Page | URL |
|------|-----|
| Dashboard | /admin/crm/dashboard |
| Leads | /admin/crm/leads |
| Clients | /admin/crm/clients |
| Deals | /admin/crm/deals |
| Proposals | /admin/crm/proposals |
| Activities | /admin/crm/activities |
| Reports | /admin/crm/reports |

---

## ✅ Features Ready

- ✅ Full CRUD for Leads, Clients, Deals, Proposals
- ✅ Kanban Pipeline with Drag-and-Drop
- ✅ Activity Timeline & Tracking  
- ✅ Sales Reports & Analytics
- ✅ Role-Based Access Control
- ✅ Responsive Design (Mobile/Tablet/Desktop)

---

## 🛑 To Stop Servers

Press **Ctrl+C** in each terminal.

---

## 📚 Full Documentation

See these files for more details:
- `BACKEND_SETUP_COMPLETE.md` - Backend config & troubleshooting
- `FULL_STACK_RUNNING.md` - Complete setup guide
- `CRM_SETUP_GUIDE.md` - CRM module details
- `CRM_COMPLETION_STATUS.md` - Project status

---

## 🚨 Common Issues

**Port 8000 already in use?**
```powershell
Get-Process php | Stop-Process -Force
```

**Port 5173 already in use?**
```powershell
Get-Process node | Stop-Process -Force
```

**Database error?**
```bash
php artisan migrate:fresh
php artisan db:seed --class=CRMPermissionSeeder
```

---

**That's it! Everything is ready to go! 🎉**
