<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'company_name' => $this->faker->company(),
            'industry' => $this->faker->randomElement(['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing']),
            'budget_range' => $this->faker->randomElement(['10k-50k', '50k-100k', '100k-500k', '500k+']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'lead_status' => $this->faker->randomElement(['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation']),
            'source' => $this->faker->randomElement(['website', 'referral', 'cold_call', 'email', 'social_media']),
            'tags' => json_encode([$this->faker->word(), $this->faker->word()]),
            'notes' => $this->faker->paragraph(),
        ];
    }
}
