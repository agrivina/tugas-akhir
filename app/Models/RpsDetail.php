<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsDetail extends Model
{
    protected $fillable = ['rps_id', 'pertemuan_ke', 'kemampuan_akhir', 'indikator', 'bahan_kajian', 'metode_pembelajaran', 'estimasi_waktu', 'pengalaman_belajar', 'penilaian_komponen', 'penilaian_bobot'];

    public function rps()
    {
        return $this->belongsTo(Rps::class);
    }
}
