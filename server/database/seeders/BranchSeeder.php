<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create(['name' => 'Koi5 Jogokaryan']);
        Branch::create(['name' => 'Koi5 Gejayan']);
        Branch::create(['name' => 'Koi5 Semarang']);
        Branch::create(['name' => 'Koi5 Purworkerto']);
        Branch::create(['name' => 'Koi5 Ungaran']);
    }
}
