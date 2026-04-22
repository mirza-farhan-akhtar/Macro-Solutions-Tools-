<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\AIServiceController;
use App\Http\Controllers\Api\Admin\BlogController;
use App\Http\Controllers\Api\Admin\FAQController;
use App\Http\Controllers\Api\Admin\TeamController;
use App\Http\Controllers\Api\Admin\CareerController;
use App\Http\Controllers\Api\Admin\ApplicationController;
use App\Http\Controllers\Api\Admin\LeadController;
use App\Http\Controllers\Api\Admin\AppointmentController;
use App\Http\Controllers\Api\Admin\PageController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\ProjectTaskController;
use App\Http\Controllers\Api\Admin\CollaborationRequestController;
use App\Http\Controllers\Api\DepartmentWorkspaceController;
use App\Http\Controllers\Finance\InvoiceController;
use App\Http\Controllers\Finance\ExpenseController;
use App\Http\Controllers\Finance\IncomeController;
use App\Http\Controllers\Finance\FinanceDashboardController;
use App\Http\Controllers\Api\EmployeeSelfController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\Admin\ClientLogoController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\Admin\ChatController as AdminChatController;

// Public routes
Route::prefix('public')->group(function () {
    Route::get('/home', [PublicController::class, 'home']);
    Route::get('/about', [PublicController::class, 'about']);
    Route::get('/services', [PublicController::class, 'services']);
    Route::get('/services/{slug}', [PublicController::class, 'serviceDetail']);
    Route::get('/ai-services', [PublicController::class, 'aiServices']);
    Route::get('/blogs', [PublicController::class, 'blogs']);
    Route::get('/blogs/{slug}', [PublicController::class, 'blogDetail']);
    Route::get('/faqs', [PublicController::class, 'faqs']);
    Route::get('/team', [PublicController::class, 'team']);
    Route::get('/careers', [PublicController::class, 'careers']);
    Route::get('/careers/{slug}', [PublicController::class, 'careerDetail']);
    Route::get('/pages/{slug}', [PublicController::class, 'page']);
    Route::get('/settings', [PublicController::class, 'settings']);
    Route::post('/contact', [PublicController::class, 'contact']);
    Route::post('/apply', [PublicController::class, 'apply']);
    Route::post('/appointment', [PublicController::class, 'appointment']);
    Route::get('/search', [PublicController::class, 'search']);
    Route::get('/client-logos', function () {
        $logos = \App\Models\ClientLogo::active()->ordered()->get();
        return response()->json(['success' => true, 'data' => $logos]);
    });

    // Chat widget (public — no auth required)
    Route::prefix('chat')->group(function () {
        Route::post('/session', [ChatController::class, 'startSession']);
        Route::post('/message', [ChatController::class, 'sendMessage']);
        Route::post('/human-request', [ChatController::class, 'requestHuman']);
        Route::get('/messages/{token}', [ChatController::class, 'getMessages']);
    });
});

// Auth routes
Route::prefix('auth')->group(function () {
    // Public auth endpoints (no authentication required)
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    
    // Protected endpoints (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/user', [AuthController::class, 'user'])->name('user');
        Route::put('/profile', [AuthController::class, 'updateProfile'])->name('updateProfile');
    });
});

// Protected routes for all authenticated users
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/dashboard/notifications', [DashboardController::class, 'notifications']);
});

// Protected admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::middleware('check.permission:dashboard.view')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/charts', [DashboardController::class, 'charts']);
        Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
    });
    
    // File Downloads
    Route::get('/download/resume/{filename}', function ($filename) {
        $path = storage_path('app/public/resumes/' . $filename);
        if (!file_exists($path)) {
            abort(404);
        }
        return response()->download($path);
    })->where('filename', '.*');
    
    // Resources
    Route::middleware('check.permission:users.view')->get('/users', [UserController::class, 'index']);
    Route::get('/users/sales', [UserController::class, 'salesUsers']);
    Route::middleware('check.permission:users.view')->get('/users/{user}', [UserController::class, 'show']);
    Route::middleware('check.permission:users.create')->post('/users', [UserController::class, 'store']);
    Route::middleware('check.permission:users.edit')->put('/users/{user}', [UserController::class, 'update']);
    Route::middleware('check.permission:users.delete')->delete('/users/{user}', [UserController::class, 'destroy']);
    Route::middleware('check.permission:users.edit')->post('/users/{user}/roles', [UserController::class, 'syncRoles']);
    
    // RBAC Routes
    Route::middleware('check.permission:roles.view')->get('/roles', [RoleController::class, 'index']);
    Route::middleware('check.permission:roles.view')->get('/roles/permissions/all', [RoleController::class, 'permissions']);
    Route::middleware('check.permission:roles.view')->get('/roles/{role}', [RoleController::class, 'show']);
    Route::middleware('check.permission:roles.create')->post('/roles', [RoleController::class, 'store']);
    Route::middleware('check.permission:roles.edit')->put('/roles/{role}', [RoleController::class, 'update']);
    Route::middleware('check.permission:roles.delete')->delete('/roles/{role}', [RoleController::class, 'destroy']);
    
    Route::middleware('check.permission:permissions.view')->get('/permissions', [PermissionController::class, 'index']);
    Route::middleware('check.permission:permissions.view')->get('/permissions/modules/all', [PermissionController::class, 'modules']);
    Route::middleware('check.permission:permissions.view')->get('/permissions/{permission}', [PermissionController::class, 'show']);
    Route::middleware('check.permission:permissions.create')->post('/permissions', [PermissionController::class, 'store']);
    Route::middleware('check.permission:permissions.edit')->put('/permissions/{permission}', [PermissionController::class, 'update']);
    Route::middleware('check.permission:permissions.delete')->delete('/permissions/{permission}', [PermissionController::class, 'destroy']);
    
    // Content Routes
    Route::middleware('check.permission:services.view')->group(function () {
        Route::get('services', [ServiceController::class, 'index']);
        Route::get('services/{service}', [ServiceController::class, 'show']);
    });
    Route::middleware('check.permission:services.create')->post('services', [ServiceController::class, 'store']);
    Route::middleware('check.permission:services.edit')->match(['put','patch'], 'services/{service}', [ServiceController::class, 'update']);
    Route::middleware('check.permission:services.delete')->delete('services/{service}', [ServiceController::class, 'destroy']);

    Route::middleware('check.permission:ai-services.view')->group(function () {
        Route::get('ai-services', [AIServiceController::class, 'index']);
        Route::get('ai-services/{ai_service}', [AIServiceController::class, 'show']);
    });
    Route::middleware('check.permission:ai-services.create')->post('ai-services', [AIServiceController::class, 'store']);
    Route::middleware('check.permission:ai-services.edit')->match(['put','patch'], 'ai-services/{ai_service}', [AIServiceController::class, 'update']);
    Route::middleware('check.permission:ai-services.delete')->delete('ai-services/{ai_service}', [AIServiceController::class, 'destroy']);

    Route::middleware('check.permission:blogs.view')->group(function () {
        Route::get('blogs', [BlogController::class, 'index']);
        Route::get('blogs/{blog}', [BlogController::class, 'show']);
    });
    Route::middleware('check.permission:blogs.create')->post('blogs', [BlogController::class, 'store']);
    Route::middleware('check.permission:blogs.edit')->match(['put','patch'], 'blogs/{blog}', [BlogController::class, 'update']);
    Route::middleware('check.permission:blogs.delete')->delete('blogs/{blog}', [BlogController::class, 'destroy']);

    Route::middleware('check.permission:faqs.view')->group(function () {
        Route::get('faqs', [FAQController::class, 'index']);
        Route::get('faqs/{faq}', [FAQController::class, 'show']);
    });
    Route::middleware('check.permission:faqs.create')->post('faqs', [FAQController::class, 'store']);
    Route::middleware('check.permission:faqs.edit')->match(['put','patch'], 'faqs/{faq}', [FAQController::class, 'update']);
    Route::middleware('check.permission:faqs.delete')->delete('faqs/{faq}', [FAQController::class, 'destroy']);

    Route::middleware('check.permission:team.view')->group(function () {
        Route::get('team', [TeamController::class, 'index']);
        Route::get('team/{team}', [TeamController::class, 'show']);
    });
    Route::middleware('check.permission:team.create')->post('team', [TeamController::class, 'store']);
    Route::middleware('check.permission:team.edit')->match(['put','patch'], 'team/{team}', [TeamController::class, 'update']);
    Route::middleware('check.permission:team.delete')->delete('team/{team}', [TeamController::class, 'destroy']);

    // Business Routes
    Route::middleware('check.permission:careers.view')->group(function () {
        Route::get('careers', [CareerController::class, 'index']);
        Route::get('careers/{career}', [CareerController::class, 'show']);
    });
    Route::middleware('check.permission:careers.create')->post('careers', [CareerController::class, 'store']);
    Route::middleware('check.permission:careers.edit')->match(['put','patch'], 'careers/{career}', [CareerController::class, 'update']);
    Route::middleware('check.permission:careers.delete')->delete('careers/{career}', [CareerController::class, 'destroy']);

    Route::middleware('check.permission:applications.view')->group(function () {
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::get('applications/{application}', [ApplicationController::class, 'show']);
    });
    Route::middleware('check.permission:applications.edit')->match(['put','patch'], 'applications/{application}', [ApplicationController::class, 'update']);
    Route::middleware('check.permission:applications.delete')->delete('applications/{application}', [ApplicationController::class, 'destroy']);

    Route::middleware('check.permission:leads.view')->group(function () {
        Route::get('leads', [LeadController::class, 'index']);
        Route::get('leads/{lead}', [LeadController::class, 'show']);
    });
    Route::middleware('check.permission:leads.create')->post('leads', [LeadController::class, 'store']);
    Route::middleware('check.permission:leads.edit')->match(['put','patch'], 'leads/{lead}', [LeadController::class, 'update']);
    Route::middleware('check.permission:leads.delete')->delete('leads/{lead}', [LeadController::class, 'destroy']);

    Route::middleware('check.permission:appointments.view')->group(function () {
        Route::get('appointments', [AppointmentController::class, 'index']);
        Route::get('appointments/{appointment}', [AppointmentController::class, 'show']);
    });
    Route::middleware('check.permission:appointments.create')->post('appointments', [AppointmentController::class, 'store']);
    Route::middleware('check.permission:appointments.edit')->match(['put','patch'], 'appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::middleware('check.permission:appointments.delete')->delete('appointments/{appointment}', [AppointmentController::class, 'destroy']);

    Route::middleware('check.permission:pages.view')->group(function () {
        Route::get('pages', [PageController::class, 'index']);
        Route::get('pages/{page}', [PageController::class, 'show']);
    });
    Route::middleware('check.permission:pages.create')->post('pages', [PageController::class, 'store']);
    Route::middleware('check.permission:pages.edit')->match(['put','patch'], 'pages/{page}', [PageController::class, 'update']);
    Route::middleware('check.permission:pages.delete')->delete('pages/{page}', [PageController::class, 'destroy']);
    
    // Project Management Routes
    Route::prefix('projects')->group(function () {
        // Project Routes
        Route::get('/', [ProjectController::class, 'index']);
        Route::get('/{id}', [ProjectController::class, 'show']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::put('/{id}', [ProjectController::class, 'update']);
        Route::delete('/{id}', [ProjectController::class, 'destroy']);
        
        // Project Member Management
        Route::post('/{id}/members', [ProjectController::class, 'assignMember']);
        Route::delete('/{id}/members/{memberId}', [ProjectController::class, 'removeMember']);
        
        // Get departments for project creation
        Route::get('/data/departments', [ProjectController::class, 'getDepartments']);
        Route::get('/data/users', [ProjectController::class, 'getUsers']);
    });
    
    // Project Task Routes
    Route::prefix('tasks')->group(function () {
        Route::get('/', [ProjectTaskController::class, 'index']);
        Route::get('/{id}', [ProjectTaskController::class, 'show']);
        Route::post('/', [ProjectTaskController::class, 'store']);
        Route::put('/{id}', [ProjectTaskController::class, 'update']);
        Route::delete('/{id}', [ProjectTaskController::class, 'destroy']);
        Route::patch('/{id}/complete', [ProjectTaskController::class, 'complete']);
        
        // Dashboard stats
        Route::get('/dashboard/stats', [ProjectTaskController::class, 'getDashboardStats']);
    });
    
    // Collaboration Request Routes
    Route::prefix('collaboration-requests')->group(function () {
        Route::get('/', [CollaborationRequestController::class, 'index']);
        Route::post('/', [CollaborationRequestController::class, 'store']);
        Route::get('/pending', [CollaborationRequestController::class, 'getPendingRequests']);
        Route::get('/stats', [CollaborationRequestController::class, 'getStats']);
        Route::get('/{id}', [CollaborationRequestController::class, 'show']);
        Route::patch('/{id}/approve', [CollaborationRequestController::class, 'approve']);
        Route::patch('/{id}/reject', [CollaborationRequestController::class, 'reject']);
        Route::patch('/{id}/cancel', [CollaborationRequestController::class, 'cancel']);
    });
    
    // Finance Routes - Protected by finance permissions
    Route::prefix('finance')->group(function () {
        // Dashboard & Reports - finance.view OR finance.reports
        Route::middleware('check.permission:finance.view|finance.reports')->group(function () {
            Route::get('dashboard', [FinanceDashboardController::class, 'dashboard']);
        });
        
        Route::middleware('check.permission:finance.view|finance.reports')->group(function () {
            Route::get('reports/profit-loss', [FinanceDashboardController::class, 'profitLoss']);
            Route::get('reports/revenue', [FinanceDashboardController::class, 'revenue']);
            Route::get('reports/expense', [FinanceDashboardController::class, 'expense']);
            Route::get('reports/export', [FinanceDashboardController::class, 'export']);
        });
        
        // Invoice Routes
        Route::middleware('check.permission:finance.view')->group(function () {
            Route::get('invoices', [InvoiceController::class, 'index']);
            Route::get('invoices/{id}', [InvoiceController::class, 'show']);
        });
        
        Route::middleware('check.permission:finance.create')->group(function () {
            Route::post('invoices', [InvoiceController::class, 'store']);
            Route::post('invoices/{id}/items', [InvoiceController::class, 'addItems']);
            Route::post('invoices/{id}/pay', [InvoiceController::class, 'recordPayment']);
        });
        
        Route::middleware('check.permission:finance.edit')->group(function () {
            Route::put('invoices/{id}', [InvoiceController::class, 'update']);
            Route::patch('invoices/{id}/status', [InvoiceController::class, 'updateStatus']);
            Route::post('invoices/{id}/send', [InvoiceController::class, 'send']);
        });
        
        Route::middleware('check.permission:finance.delete')->group(function () {
            Route::delete('invoices/{id}', [InvoiceController::class, 'destroy']);
        });
        
        // Expense Routes
        Route::middleware('check.permission:finance.view')->group(function () {
            Route::get('expenses', [ExpenseController::class, 'index']);
            Route::get('expenses/{id}', [ExpenseController::class, 'show']);
            Route::get('expense-categories', [ExpenseController::class, 'categories']);
            Route::get('expenses/summary/by-category', [ExpenseController::class, 'summaryByCategory']);
        });
        
        Route::middleware('check.permission:finance.create')->group(function () {
            Route::post('expenses', [ExpenseController::class, 'store']);
            Route::post('expense-categories', [ExpenseController::class, 'storeCategory']);
        });
        
        Route::middleware('check.permission:finance.edit')->group(function () {
            Route::put('expenses/{id}', [ExpenseController::class, 'update']);
            Route::patch('expenses/{id}/approve', [ExpenseController::class, 'approve']);
            Route::patch('expenses/{id}/reject', [ExpenseController::class, 'reject']);
            Route::put('expense-categories/{id}', [ExpenseController::class, 'updateCategory']);
        });
        
        Route::middleware('check.permission:finance.delete')->group(function () {
            Route::delete('expenses/{id}', [ExpenseController::class, 'destroy']);
            Route::delete('expense-categories/{id}', [ExpenseController::class, 'destroyCategory']);
        });
        
        // Income Routes
        Route::middleware('check.permission:finance.view')->group(function () {
            Route::get('incomes', [IncomeController::class, 'index']);
            Route::get('incomes/{id}', [IncomeController::class, 'show']);
            Route::get('incomes/summary', [IncomeController::class, 'summary']);
            Route::get('incomes/trends/monthly', [IncomeController::class, 'monthlyTrends']);
        });
        
        Route::middleware('check.permission:finance.create')->group(function () {
            Route::post('incomes', [IncomeController::class, 'store']);
        });
        
        Route::middleware('check.permission:finance.edit')->group(function () {
            Route::put('incomes/{id}', [IncomeController::class, 'update']);
        });
        
        Route::middleware('check.permission:finance.delete')->group(function () {
            Route::delete('incomes/{id}', [IncomeController::class, 'destroy']);
        });
    });
    
    // Settings
    Route::middleware('check.permission:settings.view')->get('/settings', [SettingController::class, 'index']);
    Route::middleware('check.permission:settings.edit')->put('/settings', [SettingController::class, 'update']);
    Route::middleware('check.permission:settings.edit')->post('/settings/bulk', [SettingController::class, 'updateBulk']);

    // Client Logos
    Route::get('/client-logos', [ClientLogoController::class, 'index']);
    Route::post('/client-logos', [ClientLogoController::class, 'store']);
    Route::get('/client-logos/{clientLogo}', [ClientLogoController::class, 'show']);
    Route::post('/client-logos/{clientLogo}', [ClientLogoController::class, 'update']);
    Route::delete('/client-logos/{clientLogo}', [ClientLogoController::class, 'destroy']);
    Route::post('/client-logos-reorder', [ClientLogoController::class, 'reorder']);

    // Chat Management (Admin)
    Route::prefix('chat')->group(function () {
        Route::get('/sessions', [AdminChatController::class, 'index']);
        Route::get('/sessions/stats', [AdminChatController::class, 'stats']);
        Route::get('/sessions/{chatSession}', [AdminChatController::class, 'show']);
        Route::post('/sessions/{chatSession}/reply', [AdminChatController::class, 'reply']);
        Route::patch('/sessions/{chatSession}/status', [AdminChatController::class, 'updateStatus']);
        Route::delete('/sessions/{chatSession}', [AdminChatController::class, 'destroy']);
    });
});

// CRM Module Routes
require base_path('routes/crm.php');

// HR Module Routes
require base_path('routes/hr.php');

// Department Workspace Routes (for team members to see their department's projects, team, etc)
Route::middleware('auth:sanctum')->prefix('workspace/{departmentSlug}')->group(function () {
    Route::get('/dashboard', [DepartmentWorkspaceController::class, 'dashboard']);
    Route::get('/projects', [DepartmentWorkspaceController::class, 'projects']);
    Route::get('/team-members', [DepartmentWorkspaceController::class, 'teamMembers']);
    Route::get('/notifications', [DepartmentWorkspaceController::class, 'notifications']);
});

// Employee Self-Service Routes (any authenticated user with a linked employee record)
Route::middleware('auth:sanctum')->prefix('employee')->group(function () {
    Route::get('/me', [EmployeeSelfController::class, 'me']);
    Route::get('/attendance', [EmployeeSelfController::class, 'myAttendance']);
    Route::post('/attendance/check-in', [EmployeeSelfController::class, 'checkIn']);
    Route::put('/attendance/check-out', [EmployeeSelfController::class, 'checkOut']);
    Route::get('/leaves', [EmployeeSelfController::class, 'myLeaves']);
    Route::post('/leaves', [EmployeeSelfController::class, 'applyLeave']);
    Route::get('/leaves/balance', [EmployeeSelfController::class, 'leaveBalance']);
    Route::get('/meetings', [MeetingController::class, 'myMeetings']);
    Route::get('/dashboard', [EmployeeSelfController::class, 'dashboard']);
});
