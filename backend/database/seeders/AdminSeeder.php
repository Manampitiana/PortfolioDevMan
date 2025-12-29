<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Raha admin efa misy dia aza averina
        if (!User::where('email', 'manampitianatsiriniaina@gmail.com')->exists()) {
            User::create([
                'name' => 'Tsiry',
                'email' => 'manampitianatsiriniaina@gmail.com',
                'password' => Hash::make('Ravaka@2001'),
                'role' => 'admin',
            ]);
        }
    }
}
