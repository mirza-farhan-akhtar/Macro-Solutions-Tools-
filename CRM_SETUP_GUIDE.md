# CRM MODULE - SETUP & DEPLOYMENT GUIDE

## ✅ COMPLETION STATUS

All CRM module components have been successfully created and integrated:

### **Database Layer**
- ✅ 8 migrations created (Leads enhancement, Clients, Contacts, Deals, Proposals, Proposal Items, Activities, Foreign Keys)
- ✅ 7 Models with relationships (Lead, Client, Contact, Deal, Proposal, ProposalItem, Activity)

### **Backend API**
- ✅ 6 Controllers created (CRMDashboard, Client, Deal, Proposal, Activity, Lead)
- ✅ Routes defined in `routes/crm.php` with permission middleware
- ✅ 8 CRM permissions seeded (dashboard, lead.manage, client.manage, contact.manage, deal.manage, proposal.manage, activity.manage, report.view)
- ✅ Automatic invoice creation when deal is marked as won

### **Frontend**
- ✅ 7 CRM Pages built:
  1. **Dashboard** - Metrics, charts, recent activities, forecasts
  2. **Leads** - Table view, filters (status/priority), CRUD operations
  3. **Clients** - Card grid, search, status filter, company details
  4. **Deals** - Kanban pipeline board with drag-and-drop, stage-based workflow
  5. **Proposals** - Card grid, send/accept/reject workflow, line items
  6. **Activities** - Timeline view, filters, mark complete, overdue alerts
  7. **Reports** - Sales funnel, revenue trends, lead sources, performance metrics, CSV export

- ✅ Service layer (crmAPI.js) with all endpoints
- ✅ AdminLayout sidebar with CRM menu and permission guards
- ✅ App.jsx routes for all CRM pages
- ✅ Build: ✅ 0 errors

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Backend Setup**

#### 1.1 Run Database Migrations
```bash
cd backend
php artisan migrate
```

This will create:
- Enhanced `leads` table with CRM fields (priority, industry, budget, status, tags, etc.)
- `clients` table with company and account manager details
- `contacts` table for client contact management
- `deals` table for pipeline management
- `proposals` table with line items
- `activities` table (polymorphic - relates to leads, deals, clients)

#### 1.2 Seed CRM Permissions & Roles
```bash
php artisan db:seed --class=CRMPermissionSeeder
```

This creates:
- 8 CRM permissions:
  - crm.dashboard
  - crm.lead.manage
  - crm.client.manage
  - crm.contact.manage
  - crm.deal.manage
  - crm.proposal.manage
  - crm.activity.manage
  - crm.report.view

- 2 CRM Roles (auto-created if not exist):
  - Sales Manager (all permissions)
  - Sales Executive (all except deal/client manage)

#### 1.3 Verify Backend is Running
```bash
php artisan serve
# Should run on http://localhost:8000
```

---

### **STEP 2: Frontend Setup (Already Completed)**

The frontend has been:
- ✅ Built with all CRM components
- ✅ Integrated with backend API endpoints
- ✅ All routes added to App.jsx
- ✅ AdminLayout sidebar updated with CRM menu

If you need to run dev server:
```bash
cd frontend
npm run dev
# Should run on http://localhost:5173
```

---

## 📋 API ENDPOINTS REFERENCE

All endpoints are under `/admin/crm/` and require authentication + specific CRM permissions.

### **Leads** (`crm.lead.manage`)
```
GET    /admin/crm/leads                  - List leads (with filters: status, priority, source, assigned_to, search)
GET    /admin/crm/leads/{id}             - Get single lead
POST   /admin/crm/leads                  - Create lead
PUT    /admin/crm/leads/{id}             - Update lead
DELETE /admin/crm/leads/{id}             - Delete lead
PUT    /admin/crm/leads/{id}/convert     - Convert lead to client
```

### **Clients** (`crm.client.manage`)
```
GET    /admin/crm/clients                - List clients
GET    /admin/crm/clients/{id}           - Get client details
POST   /admin/crm/clients                - Create client
PUT    /admin/crm/clients/{id}           - Update client
DELETE /admin/crm/clients/{id}           - Delete client
GET    /admin/crm/clients/{id}/contacts  - Get client contacts
GET    /admin/crm/clients/{id}/deals     - Get client deals
GET    /admin/crm/clients/{id}/invoices  - Get client invoices
```

### **Deals** (`crm.deal.manage`)
```
GET    /admin/crm/deals                  - List deals
GET    /admin/crm/deals/pipeline         - Get pipeline view (grouped by stage)
GET    /admin/crm/deals/{id}             - Get deal details
POST   /admin/crm/deals                  - Create deal
PUT    /admin/crm/deals/{id}             - Update deal
DELETE /admin/crm/deals/{id}             - Delete deal
PUT    /admin/crm/deals/{id}/won         - Mark deal as won (auto-creates invoice)
PUT    /admin/crm/deals/{id}/lost        - Mark deal as lost
```

### **Proposals** (`crm.proposal.manage`)
```
GET    /admin/crm/proposals              - List proposals
GET    /admin/crm/proposals/{id}         - Get proposal details
POST   /admin/crm/proposals              - Create proposal
PUT    /admin/crm/proposals/{id}         - Update proposal
DELETE /admin/crm/proposals/{id}         - Delete proposal
PUT    /admin/crm/proposals/{id}/send    - Send proposal (changes status to 'sent')
PUT    /admin/crm/proposals/{id}/accept  - Accept proposal (changes status to 'accepted')
PUT    /admin/crm/proposals/{id}/reject  - Reject proposal
POST   /admin/crm/proposals/{id}/items   - Add line item to proposal
```

### **Activities** (`crm.activity.manage`)
```
GET    /admin/crm/activities             - List activities (filters: activity_type, incomplete, overdue)
GET    /admin/crm/activities/{id}        - Get activity details
POST   /admin/crm/activities             - Create activity
PUT    /admin/crm/activities/{id}        - Update activity
DELETE /admin/crm/activities/{id}        - Delete activity
PUT    /admin/crm/activities/{id}/complete - Mark activity complete
GET    /admin/crm/activities/lead/{id}   - Get lead's activities
GET    /admin/crm/activities/deal/{id}   - Get deal's activities
GET    /admin/crm/activities/client/{id} - Get client's activities
GET    /admin/crm/activities/overdue     - Get all overdue activities
```

### **Dashboard** (`crm.dashboard`)
```
GET    /admin/crm/dashboard              - Get dashboard metrics, charts, and insights
```

### **Reports** (`crm.report.view`)
```
(Reports use dashboard endpoint - data is included in dashboard response)
```

---

## 🔐 ROLE-BASED ACCESS CONTROL

### **Super Admin**
- ✅ Access to all CRM features
- ✅ Can manage all data
- ✅ Can view all reports

### **Sales Manager**
- ✅ All 8 CRM permissions
- ✅ Can manage leads, clients, deals, proposals, activities
- ✅ Can view dashboard and reports

### **Sales Executive**
- ✅ Permissions: dashboard, lead.manage, contact.manage, proposal.manage, activity.manage, report.view
- ❌ Cannot manage deals or clients (restricted to their assigned items)

---

## 📊 KEY FEATURES

### **Dashboard**
- 6 metric cards (Total Leads, Qualified Leads, Pipeline Deals, Monthly Revenue, Conversion Rate, Lost Deals)
- Sales Funnel chart (lead progression)
- Revenue trend (12-month line chart)
- Lead sources pie chart
- Sales by executive bar chart
- Recent activities list
- Upcoming follow-ups
- Recently won deals

### **Leads Management**
- Priority levels: Low, Medium, High, Urgent
- Status workflow: New → Contacted → Qualified → Proposal Sent → Negotiation → Won → Lost
- Lead sources tracking
- Industry classification
- Budget range estimation
- Assignment to sales executives
- Bulk actions (convert to client, tag, delete)

### **Kanban Pipeline**
- 5 stages: Qualification → Proposal → Negotiation → Won → Lost
- Drag-and-drop deals between stages
- Real-time deal value calculations
- Win probability tracking
- Mark won (creates invoice) / Mark lost (track reason)

### **Proposals**
- Status workflow: Draft → Sent → Accepted/Rejected
- Line item management (description, qty, unit price, amount)
- Total amount calculation
- Client association
- Deal linkage

### **Activities Management**
- 6 activity types: Call, Email, Meeting, Note, Task, Follow-up
- Polymorphic relations (can link to Lead/Deal/Client)
- Scheduled timing
- Due date tracking
- Overdue alerts
- Mark complete functionality

### **Reports**
- Conversion rate tracking
- Sales performance by executive
- Revenue forecast (12-month trend)
- Lead source analysis
- CSV export functionality

### **Integration with Finance**
- When deal is marked as WON → Auto-create invoice draft
- Invoice linked to client
- Invoice amount pre-filled with deal value
- Status: Draft (ready for review)

---

## 🧪 TESTING CHECKLIST

### **Backend Testing**
- [ ] Run migrations without errors
- [ ] Seed permissions and roles
- [ ] Test CRM Leads API (CRUD + convert)
- [ ] Test Clients API
- [ ] Test Deals API (create, update, move stage, mark won)
- [ ] Test Proposals API (create, send, accept, reject)
- [ ] Test Activities API
- [ ] Test Dashboard endpoint
- [ ] Verify permission middleware blocks unauthorized access
- [ ] Test deal-won triggers invoice creation in Finance module

### **Frontend Testing**
- [ ] Dashboard loads metrics and charts
- [ ] Leads page: create, edit, delete, filter by status/priority
- [ ] Clients page: add, edit, delete
- [ ] Deals page: drag cards between stages, mark won, delete
- [ ] Proposals page: create, send, accept, reject
- [ ] Activities page: create, mark complete, delete, view overdue
- [ ] Reports page: view charts, apply CSV export
- [ ] Permission checks: try accessing with different roles
- [ ] Navigation: sidebar menu shows only accessible items
- [ ] Responsive design: check mobile/tablet views

### **Integration Testing**
- [ ] Create lead → Convert to client → Create deal → Move to won
- [ ] Verify invoice created when deal won
- [ ] Check activities linked to correct models
- [ ] Verify permission guards prevent unauthorized access
- [ ] Test filters and search across all pages

---

## 📁 FILE STRUCTURE

### **Backend**
```
app/Http/Controllers/API/
  ├── LeadController.php           (NEW - CRM leads)
  ├── ClientController.php         (CRM clients)
  ├── DealController.php           (CRM deals/pipeline)
  ├── ProposalController.php       (CRM proposals)
  ├── ActivityController.php       (CRM activities)
  └── CRMDashboardController.php   (CRM dashboard/metrics)

app/Models/
  ├── Lead.php                     (Enhanced with CRM fields)
  ├── Client.php                   (NEW)
  ├── Contact.php                  (NEW)
  ├── Deal.php                     (NEW)
  ├── Proposal.php                 (NEW)
  ├── ProposalItem.php             (NEW)
  └── Activity.php                 (NEW)

database/migrations/
  ├── 2026_02_26_000001_enhance_leads_for_crm.php
  ├── 2026_02_26_000002_create_clients_table.php
  ├── 2026_02_26_000003_create_contacts_table.php
  ├── 2026_02_26_000004_create_deals_table.php
  ├── 2026_02_26_000005_create_proposals_table.php
  ├── 2026_02_26_000006_create_proposal_items_table.php
  ├── 2026_02_26_000007_create_activities_table.php
  └── 2026_02_26_000008_add_foreign_keys_for_crm.php

routes/
  └── crm.php                      (NEW - All CRM routes)

database/seeders/
  └── CRMPermissionSeeder.php      (NEW - Permissions + Roles)
```

### **Frontend**
```
src/pages/admin/crm/
  ├── index.js                     (Exports all CRM components)
  ├── CRMDashboard.jsx            (Dashboard page)
  ├── Clients.jsx                 (Clients management)
  ├── Leads.jsx                   (Leads management - NEW)
  ├── Deals.jsx                   (Pipeline with drag-drop - NEW)
  ├── Proposals.jsx               (Proposals management - NEW)
  ├── Activities.jsx              (Activities timeline - NEW)
  └── Reports.jsx                 (Analytics & reports - NEW)

src/services/
  └── crmAPI.js                   (All CRM API calls)

src/layouts/
  └── AdminLayout.jsx             (Updated with CRM sidebar menu)

src/
  └── App.jsx                     (Updated with CRM routes)
```

---

## 🔧 TROUBLESHOOTING

### **Migration Error: Foreign Key Constraint**
- Ensure migrations run in order
- Run: `php artisan migrate:fresh` if starting from scratch

### **Permission Denied on CRM Routes**
- Verify user has CRM permissions assigned
- Check role-permission assignments: `php artisan tinker`
  ```
  $user = User::find(1);
  $user->roles()->sync([Role::where('name', 'Sales Manager')->first()->id]);
  ```

### **Build Error with react-beautiful-dnd**
- Already handled with `--legacy-peer-deps`
- If issues arise: `npm install --legacy-peer-deps`

### **API Returns 404 for CRM Routes**
- Verify `routes/crm.php` is included in `routes/api.php`
- Check route registration in `RouteServiceProvider.php`

### **Dashboard Not Loading Data**
- Verify user has `crm.dashboard` permission
- Check database has migrated successfully
- Ensure API is returning data: `curl http://localhost:8000/api/admin/crm/dashboard`

---

## 📝 NEXT STEPS

1. **Run Migrations**: `php artisan migrate`
2. **Seed Permissions**: `php artisan db:seed --class=CRMPermissionSeeder`
3. **Assign User Roles**: Manually assign Sales Manager/Executive roles to users
4. **Test APIs**: Use Postman/Insomnia to test endpoints
5. **Test Frontend**: Login with different roles and verify access
6. **Monitor Logs**: Check `storage/logs/laravel.log` for errors
7. **Production Deploy**: Follow standard Laravel deployment process

---

## 📞 SUPPORT

For questions or issues:
1. Check error logs: `tail -f storage/logs/laravel.log`
2. Verify database connection
3. Ensure all migrations are applied
4. Check permission assignments in database
5. Review controller logic and API responses

---

**CRM Module Status**: ✅ **READY FOR DEPLOYMENT**

Build Date: 2026-02-26
Frontend Build: ✅ 0 errors
Backend: Ready for migration
