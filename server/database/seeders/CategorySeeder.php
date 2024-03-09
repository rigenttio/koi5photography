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
        Category::create(['name' => 'Asessories']);
        Category::create(['name' => 'Sony']);
        Category::create(['name' => 'Cannon']);
        Category::create(['name' => 'Fujifilm']);
        Category::create(['name' => 'Nikon']);
        Category::create(['name' => 'Camera Video & Action Cam']);
        Category::create(['name' => 'Baterai & Converter']);
        Category::create(['name' => 'Mmc']);
        Category::create(['name' => 'Lighting']);
        Category::create(['name' => 'Tripod $ Stand']);
        Category::create(['name' => 'Photobooth']);
        Category::create(['name' => 'Studio']);
    }
}
