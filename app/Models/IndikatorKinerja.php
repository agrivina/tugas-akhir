<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndikatorKinerja extends Model
{
    use HasFactory;

    // Pastikan nama tabel benar jika Laravel tidak mendeteksinya secara otomatis
    protected $table = 'indikator_kinerjas';

    protected $fillable = [
        'cpl_id', 
        'kode', 
        'deskripsi'
    ];

    /**
     * Relasi Balik ke CPL (Setiap IK hanya memiliki 1 CPL)
     */
    public function cpl()
    {
        return $this->belongsTo(Cpl::class, 'cpl_id');
    }
}