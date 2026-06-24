<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->onDelete('cascade');
            $table->foreignId('dosen_biodata_id')->nullable()->constrained('dosen_biodatas')->onDelete('set null');
            $table->string('tahun_akademik', 20);
            $table->string('kode_dokumen')->nullable();
            $table->date('tanggal_penyusunan');
            $table->text('pustaka_utama');
            $table->text('pustaka_pendukung')->nullable();
            $table->text('bahan_kajian_utama')->nullable();
            $table->string('tte_dosen')->nullable();
            $table->string('tte_kaprodi')->nullable();
            $table->string('tte_kajur')->nullable();
            $table->timestamps();
            
            $table->index('dosen_biodata_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rps');
    }
};
