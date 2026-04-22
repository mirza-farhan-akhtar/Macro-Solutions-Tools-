<?php

namespace Database\Factories;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Factories\Factory;

class DealFactory extends Factory
{
    protected $model = Deal::class;

    public function definition(): array
    {
        return [
            'deal_name' => 'Deal - ' . $this->faker->catchPhrase(),
            'value' => $this->faker->numberBetween(10000, 500000),
            'stage' => $this->faker->randomElement(['qualification', 'proposal', 'negotiation', 'won', 'lost']),
            'probability' => $this->faker->numberBetween(10, 100),
            'expected_closing_date' => $this->faker->dateTimeBetween('+1 day', '+3 months'),
            'notes' => $this->faker->paragraph(),
        ];
    }
}
