<?php

namespace Database\Seeders;

use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SubCategory::create(['name' => 'subcategori 1']);
        SubCategory::create(['name' => 'subcategori 2']);
        SubCategory::create(['name' => 'subcategori 3']);
        SubCategory::create(['name' => 'subcategori 4']);
        SubCategory::create(['name' => 'subcategori 5']);
    }
}
