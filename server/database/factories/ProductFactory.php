<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => 1,
            'category_id' => 6,
            'name' => fake('id')->sentence(5),
            'thumbnail' => '3.jpg',
            'description' => fake('id')->paragraph(),
            'price' => fake()->randomFloat(2, 100000, 500000),
            'is_stock' => true
        ];
    }
}
