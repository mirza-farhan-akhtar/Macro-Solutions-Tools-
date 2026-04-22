<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check database status
echo "\n=== DATABASE STATUS ===\n";
echo "Leads: " . \App\Models\Lead::count() . " records\n";
echo "Clients: " . \App\Models\Client::count() . " records\n";
echo "Deals: " . \App\Models\Deal::count() . " records\n";
echo "Proposals: " . \App\Models\Proposal::count() . " records\n";
echo "Activities: " . \App\Models\Activity::count() . " records\n";
echo "Users: " . \App\Models\User::count() . " records\n";
echo "\n";

// Create test data
echo "=== CREATING TEST DATA ===\n";

// Get or create a user for assignments
$user = \App\Models\User::first();
if (!$user) {
    $user = \App\Models\User::create([
        'name' => 'Admin User',
        'email' => 'admin@macro.com',
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
    ]);
    echo "✓ Created admin user\n";
}

// Create test leads
echo "\nCreating Leads...\n";
$leadCount = \App\Models\Lead::count();
if ($leadCount < 5) {
    \App\Models\Lead::factory(10)->create([
        'assigned_to' => $user->id,
    ]);
    echo "✓ Created 10 test leads\n";
}

// Create test clients
echo "\nCreating Clients...\n";
$clientCount = \App\Models\Client::count();
if ($clientCount < 5) {
    \App\Models\Client::factory(5)->create([
        'assigned_account_manager' => $user->id,
    ]);
    echo "✓ Created 5 test clients\n";
}

// Create test deals
echo "\nCreating Deals...\n";
$dealCount = \App\Models\Deal::count();
if ($dealCount < 5) {
    $clients = \App\Models\Client::limit(5)->get();
    foreach ($clients as $client) {
        \App\Models\Deal::factory(2)->create([
            'client_id' => $client->id,
            'assigned_to' => $user->id,
        ]);
    }
    echo "✓ Created deals for clients\n";
}

// Create test proposals
echo "\nCreating Proposals...\n";
$proposalCount = \App\Models\Proposal::count();
if ($proposalCount < 5) {
    $deals = \App\Models\Deal::limit(5)->get();
    foreach ($deals as $deal) {
        $proposal = \App\Models\Proposal::factory(1)->create([
            'client_id' => $deal->client_id,
            'deal_id' => $deal->id,
            'created_by' => $user->id,
        ])->first();
        
        // Add line items to proposal
        \App\Models\ProposalItem::factory(3)->create([
            'proposal_id' => $proposal->id,
        ]);
    }
    echo "✓ Created proposals with line items\n";
}

// Create test activities
echo "\nCreating Activities...\n";
$activityCount = \App\Models\Activity::count();
if ($activityCount < 5) {
    $leads = \App\Models\Lead::limit(5)->get();
    foreach ($leads as $lead) {
        \App\Models\Activity::factory(2)->create([
            'related_type' => 'Lead',
            'related_id' => $lead->id,
            'created_by' => $user->id,
        ]);
    }
    echo "✓ Created activities\n";
}

echo "\n=== UPDATED DATABASE STATUS ===\n";
echo "Leads: " . \App\Models\Lead::count() . " records\n";
echo "Clients: " . \App\Models\Client::count() . " records\n";
echo "Deals: " . \App\Models\Deal::count() . " records\n";
echo "Proposals: " . \App\Models\Proposal::count() . " records\n";
echo "Activities: " . \App\Models\Activity::count() . " records\n";
echo "Users: " . \App\Models\User::count() . " records\n";

echo "\n✅ Test data created successfully!\n";
