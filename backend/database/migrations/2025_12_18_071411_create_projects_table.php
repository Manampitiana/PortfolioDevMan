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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('title');          // Nom du projet
            $table->string('slug')->unique(); // Pour URL friendly
            $table->string('short_description')->nullable(); // résumé
            $table->longText('description')->nullable();     // description complète

            // Dates
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false); // projet en cours

            // Images / Media
            $table->string('cover_image')->nullable();  // image principale
            $table->json('gallery')->nullable();        // images supplémentaires

            // Technologies
            $table->json('technologies')->nullable(); // ["React", "Laravel", "Tailwind"]

            // Project status
            $table->enum('status', ['draft', 'published'])->default('draft');

            // Optional
            $table->string('project_url')->nullable();  // lien externe / live demo
            $table->string('github_url')->nullable();   // lien repo

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
