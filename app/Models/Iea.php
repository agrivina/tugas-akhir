<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Iea extends Model
{
    use HasFactory;

    protected $fillable = ['kode', 'deskripsi'];

    // Relasi balik ke CPL
    public function cpls()
    {
        return $this->belongsToMany(Cpl::class, 'cpl_iea')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }

    // Relasi ke PPM
    public function ppms()
    {
        return $this->belongsToMany(Ppm::class, 'ppm_iea')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }
}