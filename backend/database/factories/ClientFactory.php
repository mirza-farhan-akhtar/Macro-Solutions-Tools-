<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'company_name' => $this->faker->company(),
            'industry' => $this->faker->randomElement(['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing']),
            'website' => $this->faker->url(),
            'tax_id' => $this->faker->regexify('[0-9]{10}'),
            'address' => $this->faker->address(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'notes' => $this->faker->paragraph(),
        ];
    }
}
