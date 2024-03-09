<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\BranchSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\SubCategorySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(BranchSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(SubCategorySeeder::class);
    }
}
