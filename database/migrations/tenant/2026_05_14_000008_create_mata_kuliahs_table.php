<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->string('kode_mk')->unique();
            $table->string('nama_mk');
            $table->integer('sks');
            $table->enum('jenis', ['Teori', 'Praktek'])->default('Teori');
            $table->text('deskripsi')->nullable();
            $table->string('semester', 20)->nullable();
            $table->string('sifat_pengambilan', 50)->nullable();
            $table->string('cara_pembelajaran', 100)->nullable();
            $table->foreignId('prasyarat_id')->nullable()->constrained('mata_kuliahs')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mata_kuliahs');
    }
};
