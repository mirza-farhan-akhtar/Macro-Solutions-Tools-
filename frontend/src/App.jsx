import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PermissionProvider } from './context/PermissionContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Public Pages
import Home from './pages/public/Home';
import WhatWeDo from './pages/public/WhatWeDo';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import AIServices from './pages/public/AIServices';
import Blogs from './pages/public/Blogs';
import BlogDetail from './pages/public/BlogDetail';
import FAQs from './pages/public/FAQs';
import Team from './pages/public/Team';
import Careers from './pages/public/Careers';
import CareerDetail from './pages/public/CareerDetail';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Industry Detail Pages
import WhoWeHelp from './pages/public/WhoWeHelp';
import PublicSector from './pages/public/industries/PublicSector';
import Startups from './pages/public/industries/Startups';
import Ecommerce from './pages/public/industries/Ecommerce';
import RetailCPG from './pages/public/industries/RetailCPG';
import HealthDepartment from './pages/public/industries/HealthDepartment';
import BankingFintech from './pages/public/industries/BankingFintech';
import Gaming from './pages/public/industries/Gaming';
import ARVR from './pages/public/industries/ARVR';
import AIModules from './pages/public/industries/AIModules';
import TravelHospitality from './pages/public/industries/TravelHospitality';
import Transport from './pages/public/industries/Transport';
import Construction from './pages/public/industries/Construction';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import UsersManager from './pages/admin/UsersManager';
import ServicesManager from './pages/admin/ServicesManager';
import AIServicesManager from './pages/admin/AIServicesManager';
import BlogsManager from './pages/admin/BlogsManager';
import FAQsManager from './pages/admin/FAQsManager';
import TeamManager from './pages/admin/TeamManager';
import CareersManager from './pages/admin/CareersManager';
import ApplicationsManager from './pages/admin/ApplicationsManager';
import AppointmentsManager from './pages/admin/AppointmentsManager';
import PagesManager from './pages/admin/PagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import ClientLogosManager from './pages/admin/ClientLogosManager';
import ChatManager from './pages/admin/ChatManager';
import Roles from './pages/admin/rbac/Roles';
import Permissions from './pages/admin/rbac/Permissions';

// Finance Pages
import FinanceDashboard from './pages/admin/finance/Dashboard';
import Invoices from './pages/admin/finance/Invoices';
import Expenses from './pages/admin/finance/Expenses';
import Income from './pages/admin/finance/Income';
import Reports from './pages/admin/finance/Reports';

// HR Pages
import HRDashboard from './pages/admin/hr/Dashboard';
import HRRecruitment from './pages/admin/hr/Recruitment';
import HREmployees from './pages/admin/hr/Employees';
import HRAttendance from './pages/admin/hr/Attendance';
import HRLeaves from './pages/admin/hr/Leaves';
import HRPerformance from './pages/admin/hr/Performance';
import HRReports from './pages/admin/hr/Reports';
import HRDepartments from './pages/admin/hr/Departments';
import { DepartmentDetail, DepartmentMembers, DepartmentBudget, DepartmentSettings, DepartmentProjects, DepartmentTasks, DepartmentMeetings, DepartmentProjectRequests, DepartmentAnalytics, DepartmentTimeline } from './pages/admin/hr';
import Meetings from './pages/admin/Meetings';

// CRM Pages
import { CRMDashboard, Clients, Leads, Deals, Proposals, Activities, Reports as CRMReports } from './pages/admin/crm';

// Employee Self-Service Pages
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyMeetings from './pages/employee/MyMeetings';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ChangePassword from './pages/employee/ChangePassword';

// Project Management Pages
import Projects from './pages/admin/projects/Projects';
import CreateProject from './pages/admin/projects/CreateProject';
import EditProject from './pages/admin/projects/EditProject';
import ProjectDetail from './pages/admin/projects/ProjectDetail';
import CreateTask from './pages/admin/projects/CreateTask';
import EditTask from './pages/admin/projects/EditTask';

// Department Workspace Pages
import { DepartmentWorkspace } from './pages/workspace/DepartmentWorkspace';
import { WorkspaceProjects } from './pages/workspace/WorkspaceProjects';
import { WorkspaceTeam } from './pages/workspace/WorkspaceTeam';
import { WorkspaceNotifications } from './pages/workspace/WorkspaceNotifications';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import PermissionGuard from './components/PermissionGuard';
import ScrollToTop from './components/ScrollToTop';
import { LeadFormProvider } from './context/LeadFormContext';
import LeadFormModal from './components/LeadFormModal';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <LeadFormProvider>
        <BrowserRouter>
          <LeadFormModal />
          <ChatWidget />
          <ScrollToTop />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            {/* Service Detail — all slugs handled dynamically from DB */}
            <Route path="/services/:slug" element={<ServiceDetail />} />
            {/* Industry Detail Pages */}
            <Route path="/who-we-help" element={<WhoWeHelp />} />
            <Route path="/industries/public-sector" element={<PublicSector />} />
            <Route path="/industries/startups" element={<Startups />} />
            <Route path="/industries/ecommerce" element={<Ecommerce />} />
            <Route path="/industries/retail-cpg" element={<RetailCPG />} />
            <Route path="/industries/health" element={<HealthDepartment />} />
            <Route path="/industries/banking-fintech" element={<BankingFintech />} />
            <Route path="/industries/gaming" element={<Gaming />} />
            <Route path="/industries/ar-vr" element={<ARVR />} />
            <Route path="/industries/ai-modules" element={<AIModules />} />
            <Route path="/industries/travel-hospitality" element={<TravelHospitality />} />
            <Route path="/industries/transport" element={<Transport />} />
            <Route path="/industries/construction" element={<Construction />} />
            <Route path="/ai-services" element={<AIServices />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<UsersManager />} />
            <Route path="/admin/roles" element={
              <PermissionGuard permission="roles.view">
                <Roles />
              </PermissionGuard>
            } />
            <Route path="/admin/permissions" element={
              <PermissionGuard permission="permissions.view">
                <Permissions />
              </PermissionGuard>
            } />
            <Route path="/admin/services" element={<ServicesManager />} />
            <Route path="/admin/ai-services" element={<AIServicesManager />} />
            <Route path="/admin/blogs" element={<BlogsManager />} />
            <Route path="/admin/faqs" element={<FAQsManager />} />
            <Route path="/admin/team" element={<TeamManager />} />
            <Route path="/admin/careers" element={<CareersManager />} />
            <Route path="/admin/applications" element={<ApplicationsManager />} />
            <Route path="/admin/leads" element={<Leads />} />
            <Route path="/admin/appointments" element={<AppointmentsManager />} />
            <Route path="/admin/pages" element={<PagesManager />} />
            <Route path="/admin/settings" element={<SettingsManager />} />
            <Route path="/admin/client-logos" element={<ClientLogosManager />} />

            {/* Project Management Routes */}
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/projects/create" element={<CreateProject />} />
            <Route path="/admin/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/admin/projects/:projectId/edit" element={<EditProject />} />
            <Route path="/admin/projects/:projectId/tasks/create" element={<CreateTask />} />
            <Route path="/admin/tasks/:taskId/edit" element={<EditTask />} />

            {/* Department Workspace Routes - department-slug required */}
            <Route path="/workspace/:departmentSlug" element={<DepartmentWorkspace />} />
            <Route path="/workspace/:departmentSlug/projects" element={<WorkspaceProjects />} />
            <Route path="/workspace/:departmentSlug/team" element={<WorkspaceTeam />} />
            <Route path="/workspace/:departmentSlug/notifications" element={<WorkspaceNotifications />} />

            {/* Finance Routes */}
            <Route path="/admin/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/admin/finance/invoices" element={<Invoices />} />
            <Route path="/admin/finance/expenses" element={<Expenses />} />
            <Route path="/admin/finance/income" element={<Income />} />
            <Route path="/admin/finance/reports" element={<Reports />} />

            {/* CRM Routes */}
            <Route path="/admin/crm/dashboard" element={<CRMDashboard />} />
            <Route path="/admin/crm/clients" element={<Clients />} />
            <Route path="/admin/crm/leads" element={<Leads />} />
            <Route path="/admin/crm/deals" element={<Deals />} />
            <Route path="/admin/crm/proposals" element={<Proposals />} />
            <Route path="/admin/crm/activities" element={<Activities />} />
            <Route path="/admin/crm/reports" element={<CRMReports />} />

            {/* HR Routes */}
            <Route path="/admin/hr/dashboard" element={<HRDashboard />} />
            <Route path="/admin/hr/recruitment" element={<HRRecruitment />} />
            <Route path="/admin/hr/employees" element={<HREmployees />} />
            <Route path="/admin/hr/departments" element={<HRDepartments />} />
            <Route path="/admin/hr/departments/:slug" element={<DepartmentDetail />} />
            <Route path="/admin/hr/departments/:slug/members" element={<DepartmentMembers />} />
            <Route path="/admin/hr/departments/:slug/budget" element={<DepartmentBudget />} />
            <Route path="/admin/hr/departments/:slug/settings" element={<DepartmentSettings />} />
            <Route path="/admin/hr/departments/:slug/projects" element={<DepartmentProjects />} />
            <Route path="/admin/hr/departments/:slug/tasks" element={<DepartmentTasks />} />
            <Route path="/admin/hr/departments/:slug/meetings" element={<DepartmentMeetings />} />
            <Route path="/admin/hr/departments/:slug/project-requests" element={<DepartmentProjectRequests />} />
            <Route path="/admin/hr/departments/:slug/analytics" element={<DepartmentAnalytics />} />
            <Route path="/admin/hr/departments/:slug/timeline" element={<DepartmentTimeline />} />
            <Route path="/admin/hr/attendance" element={<HRAttendance />} />
            <Route path="/admin/hr/leaves" element={<HRLeaves />} />
            <Route path="/admin/hr/performance" element={<HRPerformance />} />
            <Route path="/admin/hr/reports" element={<HRReports />} />

            {/* Meetings (accessible to hr-manager + admin) */}
            <Route path="/admin/meetings" element={<Meetings />} />

            {/* Live Chat */}
            <Route path="/admin/chat" element={<ChatManager />} />

            {/* Employee Self-Service Routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/attendance" element={<MyAttendance />} />
            <Route path="/employee/leaves" element={<MyLeaves />} />
            <Route path="/employee/meetings" element={<MyMeetings />} />
            <Route path="/employee/change-password" element={<ChangePassword />} />
          </Route>

          {/* 404 — catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>        </LeadFormProvider>      </PermissionProvider>
    </AuthProvider>
  );
}

export default App;
