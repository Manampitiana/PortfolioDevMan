<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('about_mes', function (Blueprint $table) {
            $table->id();
            
            // Profile Info
            $table->string('pdp')->nullable(); // Anaran'ny sary (path)
            $table->string('full_name');
            $table->string('title');
            
            // Bios
            $table->string('short_bio', 255)->nullable(); 
            $table->text('description')->nullable(); // Text lava
            
            // Contact Info
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_mes');
    }
};
