<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cpl extends Model
{
    use HasFactory;

    protected $fillable = ['kode', 'deskripsi'];

    // Relasi ke IEA
    public function ieas()
    {
        return $this->belongsToMany(Iea::class, 'cpl_iea')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }

    // Relasi ke PPM
    public function ppms()
    {
        return $this->belongsToMany(Ppm::class, 'cpl_ppm')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }

    // Relasi ke Mata Kuliah
    public function mataKuliahs()
    {
        return $this->belongsToMany(MataKuliah::class, 'mk_cpl', 'cpl_id', 'mata_kuliah_id')
                    ->withPivot('bobot')
                    ->withTimestamps();
    }
    // Tambahkan relasi ini di dalam class Cpl
    public function indikatorKinerjas()
    {
        return $this->hasMany(IndikatorKinerja::class, 'cpl_id');
    }
}