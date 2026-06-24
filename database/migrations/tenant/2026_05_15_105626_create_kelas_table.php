<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kelas', 10);
            $table->tinyInteger('tingkat');
            $table->string('tahun_masuk', 10);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};