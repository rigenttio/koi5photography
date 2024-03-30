<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Accessories',
            'Sony',
            'Canon',
            'Fujifilm',
            'Nikon',
            'Kamera Video & Action Cam',
            'Baterai & Converter',
            'MMC',
            'Lighting',
            'Tripod & Stand',
            'Photobooth',
            'Studio Foto',
            'Fuji',
            'Lumix',
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }
    }
}
