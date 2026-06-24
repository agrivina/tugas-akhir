<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dosen_biodata_mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_biodata_id')->constrained('dosen_biodatas')->onDelete('cascade');
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['dosen_biodata_id', 'mata_kuliah_id'], 'dosen_mk_unique');
            $table->index('dosen_biodata_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dosen_biodata_mata_kuliah');
    }
};
