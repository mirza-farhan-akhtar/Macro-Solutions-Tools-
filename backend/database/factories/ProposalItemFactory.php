<?php

namespace Database\Factories;

use App\Models\ProposalItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProposalItemFactory extends Factory
{
    protected $model = ProposalItem::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 10);
        $unitPrice = $this->faker->numberBetween(100, 5000);
        
        return [
            'description' => $this->faker->catchPhrase(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'amount' => $quantity * $unitPrice,
        ];
    }
}
