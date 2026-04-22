<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CRMDashboardController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\DealController;
use App\Http\Controllers\API\ProposalController;
use App\Http\Controllers\API\ActivityController;
use App\Http\Controllers\API\LeadController;

// CRM Module Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/crm')->group(function () {

    // CRM Dashboard
    Route::middleware('check.permission:crm.dashboard')->get('/dashboard', [CRMDashboardController::class, 'index']);

    // Leads
    Route::middleware('check.permission:crm.lead.manage')->group(function () {
        Route::get('/leads', [LeadController::class, 'index']);
        Route::get('/leads/{lead}', [LeadController::class, 'show']);
        Route::post('/leads', [LeadController::class, 'store']);
        Route::put('/leads/{lead}', [LeadController::class, 'update']);
        Route::delete('/leads/{lead}', [LeadController::class, 'destroy']);

        // Lead Actions
        Route::put('/leads/{lead}/convert', [LeadController::class, 'convertToClient']);
    });

    // Clients
    Route::middleware('check.permission:crm.client.manage')->group(function () {
        Route::get('/clients', [ClientController::class, 'index']);
        Route::get('/clients/{id}', [ClientController::class, 'show']);
        Route::post('/clients', [ClientController::class, 'store']);
        Route::put('/clients/{id}', [ClientController::class, 'update']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

        // Client Relations
        Route::get('/clients/{clientId}/contacts', [ClientController::class, 'contacts']);
        Route::get('/clients/{clientId}/deals', [ClientController::class, 'deals']);
        Route::get('/clients/{clientId}/invoices', [ClientController::class, 'invoices']);
    });

    // Deals / Pipeline
    Route::middleware('check.permission:crm.deal.manage')->group(function () {
        Route::get('/deals', [DealController::class, 'index']);
        Route::get('/deals/pipeline', [DealController::class, 'pipeline']);
        Route::get('/deals/{id}', [DealController::class, 'show']);
        Route::post('/deals', [DealController::class, 'store']);
        Route::put('/deals/{id}', [DealController::class, 'update']);
        Route::delete('/deals/{id}', [DealController::class, 'destroy']);

        // Deal Actions
        Route::put('/deals/{id}/won', [DealController::class, 'markWon']);
        Route::put('/deals/{id}/lost', [DealController::class, 'markLost']);
    });

    // Proposals
    Route::middleware('check.permission:crm.proposal.manage')->group(function () {
        Route::get('/proposals', [ProposalController::class, 'index']);
        Route::get('/proposals/{id}', [ProposalController::class, 'show']);
        Route::post('/proposals', [ProposalController::class, 'store']);
        Route::put('/proposals/{id}', [ProposalController::class, 'update']);
        Route::delete('/proposals/{id}', [ProposalController::class, 'destroy']);

        // Proposal Actions
        Route::put('/proposals/{id}/send', [ProposalController::class, 'send']);
        Route::put('/proposals/{id}/accept', [ProposalController::class, 'accept']);
        Route::put('/proposals/{id}/reject', [ProposalController::class, 'reject']);

        // Proposal Items
        Route::post('/proposals/{proposalId}/items', [ProposalController::class, 'addItem']);
    });

    // Activities
    Route::middleware('check.permission:crm.activity.manage')->group(function () {
        // Specific routes first
        Route::get('/activities/overdue', [ActivityController::class, 'overdue']);
        Route::get('/activities/lead/{leadId}', [ActivityController::class, 'forLead']);
        Route::get('/activities/deal/{dealId}', [ActivityController::class, 'forDeal']);
        Route::get('/activities/client/{clientId}', [ActivityController::class, 'forClient']);
        
        // Generic routes last
        Route::get('/activities', [ActivityController::class, 'index']);
        Route::get('/activities/{id}', [ActivityController::class, 'show']);
        Route::post('/activities', [ActivityController::class, 'store']);
        Route::put('/activities/{id}', [ActivityController::class, 'update']);
        Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);
        Route::put('/activities/{id}/complete', [ActivityController::class, 'complete']);
    });

});
