<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('capaian_ieas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->foreignId('iea_id')->constrained('ieas')->cascadeOnDelete();
            $table->tinyInteger('semester');
            $table->string('tahun_akademik', 20);
            $table->decimal('nilai', 5, 2)->default(0);
            $table->timestamps();
            $table->unique(['mahasiswa_id','iea_id','semester','tahun_akademik'], 'uq_capaian_iea');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('capaian_ieas');
    }
};