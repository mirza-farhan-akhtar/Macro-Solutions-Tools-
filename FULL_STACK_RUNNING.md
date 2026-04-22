# 🎉 FULL STACK SETUP - COMPLETE & RUNNING

## ✅ Current Status

| Component | Status | Command | URL |
|-----------|--------|---------|-----|
| **Backend API** | ✅ Running | `php artisan serve --host=127.0.0.1 --port=8000` | http://127.0.0.1:8000 |
| **Frontend** | ⏳ Ready | `npm run dev` (from frontend folder) | http://localhost:5173 |
| **Database** | ✅ Connected | MySQL on 127.0.0.1 | macro_solutions |
| **CRM Module** | ✅ Ready | All endpoints configured | /admin/crm/* |

---

## 🚀 START FULL STACK IN 30 SECONDS

### **Open TWO Terminals:**

#### **Terminal 1 - Backend (Already Running or Run This):**
```powershell
cd e:\MACRO\backend
php artisan serve --host=127.0.0.1 --port=8000
```

#### **Terminal 2 - Frontend:**
```powershell
cd e:\MACRO\frontend
npm run dev
```

### **That's It!**

Then open your browser:
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

---

## 🧭 Navigate the CRM Module

### **From Frontend Dashboard (http://localhost:5173)**

1. **Login** if not already logged in
2. **Click Admin Panel** or go to `/admin`
3. **Sidebar Menu** → **CRM Section** shows:
   - ✅ Dashboard
   - ✅ Leads
   - ✅ Clients
   - ✅ Deals
   - ✅ Proposals
   - ✅ Activities
   - ✅ Reports

### **Direct Links to CRM Pages:**
```
Dashboard:  http://localhost:5173/admin/crm/dashboard
Leads:      http://localhost:5173/admin/crm/leads
Clients:    http://localhost:5173/admin/crm/clients
Deals:      http://localhost:5173/admin/crm/deals
Proposals:  http://localhost:5173/admin/crm/proposals
Activities: http://localhost:5173/admin/crm/activities
Reports:    http://localhost:5173/admin/crm/reports
```

---

## 📊 What You Can Do Now

### **✅ Fully Implemented:**

1. **CRM Dashboard**
   - 6 metric cards (leads, deals, revenue, conversion)
   - Sales funnel chart
   - Revenue trend (12 months)
   - Lead sources pie chart
   - Team performance bar chart
   - Recent activities feed

2. **Leads Management**
   - View all CRM leads in table
   - Filter by status, priority, source
   - Create new lead (modal form)
   - Edit lead details
   - Delete lead
   - Priority levels: Low, Medium, High, Urgent
   - Status: New → Contacted → Qualified → Proposal Sent → Won → Lost

3. **Clients Management**
   - View clients in card grid
   - Add new client
   - Edit client info
   - Company details, industry, website
   - Account manager assignment
   - Status: Active/Inactive

4. **Sales Pipeline (Kanban Board)**
   - 5 stages: Qualification → Proposal → Negotiation → Won → Lost
   - **Drag-and-drop** deals between stages
   - Real-time stage updates
   - Deal value totals per stage
   - Mark deal as Won (auto-creates invoice in Finance)
   - Mark deal as Lost
   - Deal probability tracking

5. **Proposals**
   - View all proposals in card grid
   - Create new proposal
   - Add line items (description, qty, unit price)
   - Status workflow:
     - Draft → Send
     - Sent → Accept/Reject
     - Edit details, delete
   - Total amount calculation

6. **Activities**
   - Timeline view of all activities
   - Activity types: Call, Email, Meeting, Note, Task, Follow-up
   - Filter by type, related object (Lead/Deal/Client)
   - Overdue activity alerts
   - Mark activity complete
   - Scheduled timing
   - Assigned to team members

7. **Reports & Analytics**
   - Sales funnel conversion visualization
   - Revenue trends (12-month chart)
   - Lead source distribution (pie chart)
   - Sales by executive (bar chart)
   - CSV export of reports
   - Conversion rate metrics
   - Monthly revenue tracking

---

## 🔐 Role-Based Access

### **Super Admin** - Full Access
- All CRM features
- All permissions

### **Sales Manager** - Full CRM Access
- Manage all leads, deals, clients, proposals, activities
- View reports
- Dashboard access

### **Sales Executive** - Limited Access
- Manage assigned leads & deals
- View proposals & activities
- Dashboard access (only their data)
- Cannot manage clients

### **Assign Role to User:**
```bash
php artisan tinker
$user = User::find(1);
$user->assignRole('Sales Manager');  # or 'Sales Executive'
```

---

## 💾 Database Reset

If you need to reset everything and start fresh:

```bash
cd backend

# Clear all data and re-migrate
php artisan migrate:fresh --seed

# Re-seed CRM permissions
php artisan db:seed --class=CRMPermissionSeeder

# Create test data
php artisan tinker
App\Models\Lead::factory(10)->create();
App\Models\Client::factory(5)->create();
App\Models\Deal::factory(8)->create();
```

---

## 🛠️ Common Commands

### **Check Server Status:**
```powershell
# Test backend is responding
Invoke-WebRequest -Uri "http://127.0.0.1:8000" -UseBasicParsing

# Test frontend is responding
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

### **View Database:**
```bash
# Use MySQL client
mysql -u root -p macro_solutions

# Or use Artisan
php artisan tinker
App\Models\Lead::count();
App\Models\Client::all();
```

### **Kill Stuck Processes:**
```powershell
# Kill PHP
Get-Process php | Stop-Process -Force

# Kill Node
Get-Process node | Stop-Process -Force
```

### **View Logs:**
```bash
# Backend logs
Get-Content backend/storage/logs/laravel.log -Tail 50 -Wait

# Check specific date log
Get-Content "backend/storage/logs/laravel-2026-02-24.log"
```

---

## 🎯 Next Steps for Development

### **1. Create Sample Data:**
```bash
cd backend
php artisan tinker

# Create multiple leads
App\Models\Lead::factory(10)->create();

# Create multiple clients
App\Models\Client::factory(5)->create();

# Create deals
App\Models\Deal::factory(8)->create();

# Create proposals
App\Models\Proposal::factory(5)->create();

# Create activities
App\Models\Activity::factory(15)->create();
```

### **2. Test with Different Roles:**
- Create user: `User::create(['name' => 'Sales Exec', 'email' => 'exec@macro.com', 'password' => Hash\make('pass')])`
- Assign role: `$user->assignRole('Sales Executive')`
- Login and verify restricted access

### **3. Test CRM Workflow:**
1. Create a Lead
2. Convert lead to Client
3. Create Deal linked to Client
4. Create Proposal with line items
5. Move Deal through stages (Qualification → Negotiation → Won)
6. Verify Invoice auto-created in Finance module
7. Create Activities (calls, meetings, notes)
8. View Reports and Analytics

### **4. Integration Testing:**
- CRM-Finance: Deal Won → Invoice Draft Created
- CRM-HR: Activity assignment to team members
- Permissions: Test different roles
- API: Use Postman/Insomnia to test endpoints

---

## 📱 API Endpoints Reference

### **Authentication:**
```
POST   /api/login                          - User login
POST   /api/logout                         - User logout
GET    /api/user                           - Current user info
```

### **CRM - Leads:**
```
GET    /api/admin/crm/leads                - List leads with filters
POST   /api/admin/crm/leads                - Create lead
PUT    /api/admin/crm/leads/{id}           - Update lead
DELETE /api/admin/crm/leads/{id}           - Delete lead
PUT    /api/admin/crm/leads/{id}/convert   - Convert to client
```

### **CRM - Clients:**
```
GET    /api/admin/crm/clients              - List clients
POST   /api/admin/crm/clients              - Create client
PUT    /api/admin/crm/clients/{id}         - Update client
DELETE /api/admin/crm/clients/{id}         - Delete client
GET    /api/admin/crm/clients/{id}/deals   - Get client's deals
```

### **CRM - Deals:**
```
GET    /api/admin/crm/deals/pipeline       - Kanban pipeline view
GET    /api/admin/crm/deals/{id}           - Get deal details
POST   /api/admin/crm/deals                - Create deal
PUT    /api/admin/crm/deals/{id}           - Update deal (including stage)
DELETE /api/admin/crm/deals/{id}           - Delete deal
PUT    /api/admin/crm/deals/{id}/won       - Mark as won (creates invoice)
PUT    /api/admin/crm/deals/{id}/lost      - Mark as lost
```

### **CRM - Proposals:**
```
GET    /api/admin/crm/proposals            - List proposals
POST   /api/admin/crm/proposals            - Create proposal
PUT    /api/admin/crm/proposals/{id}/send  - Send proposal
PUT    /api/admin/crm/proposals/{id}/accept - Accept proposal
PUT    /api/admin/crm/proposals/{id}/reject - Reject proposal
POST   /api/admin/crm/proposals/{id}/items - Add line item
```

### **CRM - Activities:**
```
GET    /api/admin/crm/activities           - List activities with filters
POST   /api/admin/crm/activities           - Create activity
PUT    /api/admin/crm/activities/{id}      - Update activity
DELETE /api/admin/crm/activities/{id}      - Delete activity
PUT    /api/admin/crm/activities/{id}/complete - Mark complete
GET    /api/admin/crm/activities/overdue   - Get overdue activities
```

### **CRM - Dashboard:**
```
GET    /api/admin/crm/dashboard            - Get all metrics & charts
```

---

## ✨ Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| CRM Dashboard | ✅ | Metrics, charts, activity feeds |
| Leads Management | ✅ | Full CRUD, filters, conversion |
| Clients Management | ✅ | Full CRUD, company info |
| Sales Pipeline | ✅ | Kanban board, drag-drop, stages |
| Proposals | ✅ | Line items, send/accept workflow |
| Activities | ✅ | Timeline, types, assignments |
| Reports | ✅ | Analytics, CSV export |
| Permissions | ✅ | 8 CRM permissions, 3 roles |
| CRM-Finance Integration | ✅ | Deal won → Invoice draft |
| Responsive Design | ✅ | Mobile, tablet, desktop |
| Glass UI Design | ✅ | Frosted effects, animations |

---

## 🐛 Troubleshooting

### **Port Already in Use:**
```powershell
# Find process on port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID 12345 /F
```

### **Migration Errors:**
```bash
# Rollback and retry
php artisan migrate:rollback
php artisan migrate

# Or fresh start
php artisan migrate:fresh
```

### **Permission Errors:**
```bash
# Make sure cache and logs are writable
php artisan cache:clear
php artisan config:clear
```

### **CSS Not Loading:**
```bash
# If Tailwind styles missing
cd frontend
npm run build
```

---

## 📞 Support

- **Documentation**: See [BACKEND_SETUP_COMPLETE.md](./BACKEND_SETUP_COMPLETE.md)
- **Setup Guide**: See [CRM_SETUP_GUIDE.md](./CRM_SETUP_GUIDE.md)
- **Status Report**: See [CRM_COMPLETION_STATUS.md](./CRM_COMPLETION_STATUS.md)
- **Backend Logs**: Check `backend/storage/logs/laravel.log`
- **Browser Console**: F12 → Console tab for frontend errors

---

**✅ YOU'RE ALL SET!**

Just run the two commands above and you'll have a fully functional CRM system running! 🎉

**Start Now:**
```powershell
# Terminal 1
cd e:\MACRO\backend
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2
cd e:\MACRO\frontend  
npm run dev

# Then visit: http://localhost:5173
```
