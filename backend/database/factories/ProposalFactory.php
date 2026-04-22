<?php

namespace Database\Factories;

use App\Models\Proposal;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProposalFactory extends Factory
{
    protected $model = Proposal::class;

    public function definition(): array
    {
        $total = $this->faker->numberBetween(5000, 50000);
        
        return [
            'title' => 'Proposal - ' . $this->faker->catchPhrase(),
            'description' => $this->faker->paragraph(),
            'total_amount' => $total,
            'status' => $this->faker->randomElement(['draft', 'sent', 'accepted', 'rejected']),
        ];
    }
}
