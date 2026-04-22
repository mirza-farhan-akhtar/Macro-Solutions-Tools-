<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        return [
            'activity_type' => $this->faker->randomElement(['call', 'email', 'meeting', 'note', 'task', 'follow_up']),
            'description' => $this->faker->paragraph(),
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+30 days'),
            'completed' => $this->faker->boolean(30),
        ];
    }
}
