<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rps extends Model
{
protected $fillable = [
    'mata_kuliah_id', 'dosen_biodata_id', 'tahun_akademik', 'kode_dokumen',
    'tanggal_penyusunan', 'pustaka_utama', 'pustaka_pendukung', 
    'bahan_kajian_utama', 'tte_dosen', 'tte_kaprodi', 'tte_kajur'
];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function getDosenBiodataAttribute(): ?DosenBiodata
    {
        if (!$this->dosen_biodata_id) {
            return null;
        }

        return DosenBiodata::query()->find($this->dosen_biodata_id);
    }

    public function penilaians()
    {
        return $this->hasMany(RpsPenilaian::class);
    }

    public function details()
    {
        return $this->hasMany(RpsDetail::class);
    }
}