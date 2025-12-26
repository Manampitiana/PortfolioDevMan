<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        User::factory()->create([
            'name' => 'Tsiry',
            'email' => 'manampitianatsiriniaina@gmail.com',
            'password' => bcrypt('Ravaka@2001'),
            'role' => 'admin',
        ]);
    }
}
