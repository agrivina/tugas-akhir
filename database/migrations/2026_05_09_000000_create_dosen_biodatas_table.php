<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dosen_biodatas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('gelar_depan')->nullable();
            $table->string('gelar_belakang')->nullable();
            $table->string('nip')->unique()->nullable();
            $table->string('nidn')->unique()->nullable();
            $table->string('email')->unique();
            $table->string('no_hp')->nullable();
            $table->string('prodi');
            $table->string('jabatan_akademik');
            $table->text('bidang_keahlian')->nullable();
            $table->text('alamat')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dosen_biodatas');
    }
};
