<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'branch_id' => 1,
            'email' => 'admin.jogokaryan@email.com',
            'role' => 'admin',
            'password' => Hash::make('password')
        ]);

        Admin::create([
            'branch_id' => 2,
            'email' => 'admin.gejayan@email.com',
            'role' => 'admin',
            'password' => Hash::make('password')
        ]);

        Admin::create([
            'branch_id' => 3,
            'email' => 'admin.semarang@email.com',
            'role' => 'admin',
            'password' => Hash::make('password')
        ]);

        Admin::create([
            'branch_id' => 4,
            'email' => 'admin.purwokerto@email.com',
            'role' => 'admin',
            'password' => Hash::make('password')
        ]);

        Admin::create([
            'branch_id' => 5,
            'email' => 'admin.ungaran@email.com',
            'role' => 'admin',
            'password' => Hash::make('password')
        ]);

        Admin::create([
            'email' => 'superadmin@email.com',
            'role' => 'super admin',
            'password' => Hash::make('password')
        ]);
    }
}
