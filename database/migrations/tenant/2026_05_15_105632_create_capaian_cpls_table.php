<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('capaian_cpls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->foreignId('cpl_id')->constrained('cpls')->cascadeOnDelete();
            $table->tinyInteger('semester');
            $table->string('tahun_akademik', 20);
            $table->decimal('nilai', 5, 2)->default(0);
            $table->boolean('tercapai')->default(false);
            $table->timestamps();
            $table->unique(['mahasiswa_id','cpl_id','semester','tahun_akademik'], 'uq_capaian_cpl');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('capaian_cpls');
    }
};