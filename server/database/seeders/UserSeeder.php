<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Rigent',
            'last_name' => 'Tio Salma',
            'email' => 'user@email.com',
            'no_tlp' => '083459344232',
            'address' => 'Bantul',
            'email_verified_at' => now(),
            'password' => Hash::make('password')
        ]);
    }
}
