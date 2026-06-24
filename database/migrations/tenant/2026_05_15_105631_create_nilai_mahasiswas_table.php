<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('nilai_mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->foreignId('cpmk_id')->constrained('cpmks')->cascadeOnDelete();
            $table->foreignId('rps_id')->constrained('rps')->cascadeOnDelete();
            $table->decimal('quiz', 5, 2)->default(0);
            $table->decimal('tugas', 5, 2)->default(0);
            $table->decimal('project', 5, 2)->default(0);
            $table->decimal('uts', 5, 2)->default(0);
            $table->decimal('uas', 5, 2)->default(0);
            $table->decimal('nilai_akhir_cpmk', 5, 2)->default(0);
            $table->timestamps();
            $table->unique(['mahasiswa_id', 'cpmk_id', 'rps_id'], 'uq_nilai_mhs');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('nilai_mahasiswas');
    }
};