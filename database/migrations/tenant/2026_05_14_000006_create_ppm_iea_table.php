<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppm_iea', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppm_id')->constrained('ppms')->onDelete('cascade');
            $table->foreignId('iea_id')->constrained('ieas')->onDelete('cascade');
            $table->boolean('is_selected')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppm_iea');
    }
};
