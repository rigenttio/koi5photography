<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create(['name' => 'Baru']);
    }
}
