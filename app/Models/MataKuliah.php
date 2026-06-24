<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliahs';
    protected $fillable = [
        'kode_mk',
        'nama_mk',
        'sks',
        'jenis',
        'deskripsi',
        'semester',
        'sifat_pengambilan',
        'cara_pembelajaran',
        'prasyarat_id',
    ];
    // Relasi ke CPL (Sudah paduka miliki)
    public function cpls()
    {
        return $this->belongsToMany(Cpl::class, 'mk_cpl', 'mata_kuliah_id', 'cpl_id')
                    ->withPivot('bobot')
                    ->withTimestamps();
    }
    public function prasyarat()
{
    return $this->belongsTo(MataKuliah::class, 'prasyarat_id');
}
    // Relasi ke CPMK (Baru ditambahkan)
    public function cpmks()
    {
        return $this->hasMany(Cpmk::class, 'mata_kuliah_id');
    }

    // Relasi ke RPS
    public function rps()
    {
        return $this->hasMany(Rps::class);
    }

    // Relasi ke Dosen Pengampu (Many-to-Many via pivot)
    public function dosenPengampus()
    {
        return $this->belongsToMany(DosenBiodata::class, 'dosen_biodata_mata_kuliah', 'mata_kuliah_id', 'dosen_biodata_id')
                    ->withTimestamps();
    }
}