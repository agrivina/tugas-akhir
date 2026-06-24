<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cpmk extends Model
{
    use HasFactory;

    protected $fillable = ['mata_kuliah_id', 'kode_cpmk', 'deskripsi'];

    /**
     * Relasi ke Mata Kuliah (CPMK mengabdi pada satu Mata Kuliah)
     */
    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    /**
     * Relasi ke Indikator Kinerja (Many-to-Many)
     * Inilah kunci otomatisasi CPL di RPS paduka.
     */
    public function indikatorKinerjas()
    {
        return $this->belongsToMany(IndikatorKinerja::class, 'cpmk_indikator_kinerja', 'cpmk_id', 'indikator_kinerja_id')
                    ->withTimestamps();
    }
}