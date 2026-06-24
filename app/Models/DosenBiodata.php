<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosenBiodata extends Model
{
    use HasFactory;

    // protected $connection = 'central'; // ← kembalikan ini

    protected $fillable = [
        'nama_lengkap', 'gelar_depan', 'gelar_belakang',
        'nip', 'nidn', 'email', 'no_hp', 'prodi',
        'jabatan_akademik', 'bidang_keahlian', 'alamat',
    ];


    public function mataKuliahs()
    {
        return $this->belongsToMany(
            MataKuliah::class,
            'dosen_biodata_mata_kuliah',
            'dosen_biodata_id',
            'mata_kuliah_id'
        )->withTimestamps();
    }

    public function getNamaLengkapGelarAttribute(): string
    {
        return trim(implode(' ', array_filter([
            $this->gelar_depan,
            $this->nama_lengkap,
            $this->gelar_belakang,
        ])));
    }
}