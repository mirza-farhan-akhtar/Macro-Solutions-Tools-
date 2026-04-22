<?php

use App\Http\Controllers\Api\HRDashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\PerformanceReviewController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\RecruitmentController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\LeaveQuotaController;
use App\Http\Controllers\Api\MeetingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'check.permission:hr.view'])->prefix('admin/hr')->group(function () {
    // HR Dashboard
    Route::get('/dashboard', [HRDashboardController::class, 'dashboard']);

    // Employee Management
    Route::middleware('check.permission:hr.employees')->group(function () {
        Route::get('/employees', [EmployeeController::class, 'index']);
        Route::get('/employees/{id}', [EmployeeController::class, 'show']);
        Route::post('/employees', [EmployeeController::class, 'store'])->middleware('check.permission:hr.create');
        Route::put('/employees/{id}', [EmployeeController::class, 'update'])->middleware('check.permission:hr.edit');
        Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->middleware('check.permission:hr.delete');
    });

    // Attendance Management
    Route::middleware('check.permission:hr.attendance')->group(function () {
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::post('/attendance', [AttendanceController::class, 'store'])->middleware('check.permission:hr.create');
        Route::put('/attendance/{id}', [AttendanceController::class, 'update'])->middleware('check.permission:hr.edit');
        Route::get('/attendance/{employeeId}/{month}', [AttendanceController::class, 'getMonthlyAttendance']);
    });

    // Leave Management
    Route::middleware('check.permission:hr.leave')->group(function () {
        Route::get('/leaves', [LeaveRequestController::class, 'index']);
        Route::post('/leaves', [LeaveRequestController::class, 'store'])->middleware('check.permission:hr.create');
        Route::put('/leaves/{id}/approve', [LeaveRequestController::class, 'approve'])->middleware('check.permission:hr.edit');
        Route::put('/leaves/{id}/reject', [LeaveRequestController::class, 'reject'])->middleware('check.permission:hr.edit');
        Route::get('/leaves/{employeeId}/balance', [LeaveRequestController::class, 'getEmployeeLeaveBalance']);
    });

    // Performance Reviews
    Route::middleware('check.permission:hr.performance')->group(function () {
        Route::get('/performance-reviews', [PerformanceReviewController::class, 'index']);
        Route::post('/performance-reviews', [PerformanceReviewController::class, 'store'])->middleware('check.permission:hr.create');
        Route::put('/performance-reviews/{id}', [PerformanceReviewController::class, 'update'])->middleware('check.permission:hr.edit');
        Route::get('/performance-reviews/department/{department}', [PerformanceReviewController::class, 'getDepartmentStats']);
    });

    // Interviews
    Route::middleware('check.permission:hr.recruitment')->group(function () {
        Route::get('/interviews', [InterviewController::class, 'index']);
        Route::post('/interviews', [InterviewController::class, 'store'])->middleware('check.permission:hr.create');
        Route::put('/interviews/{id}', [InterviewController::class, 'update'])->middleware('check.permission:hr.edit');
        Route::put('/interviews/{id}/complete', [InterviewController::class, 'completeInterview'])->middleware('check.permission:hr.edit');
    });

    // Departments - Comprehensive Management
    Route::group(['prefix' => 'departments'], function () {
        Route::get('/', [DepartmentController::class, 'index']);
        Route::get('/tree', [DepartmentController::class, 'tree']);
        Route::post('/', [DepartmentController::class, 'store'])->middleware('check.permission:department.create');
        // Specific department sub-routes MUST come before the generic {department} route
        Route::get('/{department}/employees', [DepartmentController::class, 'employees']);
        Route::get('/{department}/projects', [DepartmentController::class, 'projects']);
        Route::get('/{department}/tasks', [DepartmentController::class, 'tasks']);
        Route::get('/{department}/meetings', [DepartmentController::class, 'meetings']);
        Route::get('/{department}/analytics', [DepartmentController::class, 'analytics']);
        Route::get('/{department}/timeline', [DepartmentController::class, 'timeline']);
        Route::get('/{department}/budget', [DepartmentController::class, 'budget']);
        Route::get('/{department}/project-requests', [DepartmentController::class, 'projectRequests']);
        Route::get('/{department}/project-requests-sent', [DepartmentController::class, 'projectRequestsSent']);
        Route::post('/{department}/projects', [DepartmentController::class, 'storeProject'])->middleware('check.permission:department.create');
        Route::post('/{department}/send-project-request', [DepartmentController::class, 'sendProjectRequest'])->middleware('check.permission:department.create');
        Route::post('/{department}/tasks', [DepartmentController::class, 'createTask'])->middleware('check.permission:department.create');
        Route::post('/{department}/project-requests/{requestId}/approve', [DepartmentController::class, 'approveProjectRequest'])->middleware('check.permission:department.edit');
        Route::post('/{department}/project-requests/{requestId}/reject', [DepartmentController::class, 'rejectProjectRequest'])->middleware('check.permission:department.edit');
        // Generic department routes
        Route::get('/{department}', [DepartmentController::class, 'show']);
        Route::put('/{department}', [DepartmentController::class, 'update'])->middleware('check.permission:department.edit');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->middleware('check.permission:department.delete');
        Route::post('/{department}/assign-users', [DepartmentController::class, 'assignUsers'])->middleware('check.permission:department.assign.users');
        Route::post('/{department}/remove-user', [DepartmentController::class, 'removeUser'])->middleware('check.permission:department.assign.users');
    });

    // Leave Quotas (per-employee override)
    Route::get('/leave-quotas/all', [LeaveQuotaController::class, 'index']);
    Route::get('/leave-quotas', [LeaveQuotaController::class, 'show']);
    Route::post('/leave-quotas', [LeaveQuotaController::class, 'update']);
    Route::delete('/leave-quotas', [LeaveQuotaController::class, 'reset']);

    // Meetings (admin panel - all meetings visible to admin)
    Route::get('/meetings', [MeetingController::class, 'index']);
    Route::post('/meetings', [MeetingController::class, 'store']);
    Route::put('/meetings/{id}', [MeetingController::class, 'update']);
    Route::delete('/meetings/{id}', [MeetingController::class, 'destroy']);

    // Recruitment
    Route::middleware('check.permission:hr.recruitment')->group(function () {
        Route::get('/recruitment/jobs', [RecruitmentController::class, 'getJobPosts']);
        Route::post('/recruitment/jobs', [RecruitmentController::class, 'createJobPost'])->middleware('check.permission:hr.create');
        Route::put('/recruitment/jobs/{id}', [RecruitmentController::class, 'updateJobPost'])->middleware('check.permission:hr.edit');
        Route::delete('/recruitment/jobs/{id}', [RecruitmentController::class, 'deleteJobPost'])->middleware('check.permission:hr.delete');
        Route::get('/recruitment/applications', [RecruitmentController::class, 'getApplications']);
        Route::put('/recruitment/applications/{id}/status', [RecruitmentController::class, 'updateApplicationStatus'])->middleware('check.permission:hr.edit');
        Route::post('/recruitment/applications/{id}/hire', [RecruitmentController::class, 'hireApplicant'])->middleware('check.permission:hr.create');
        Route::get('/recruitment/stats', [RecruitmentController::class, 'getRecruitmentStats']);
    });
});
