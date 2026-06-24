<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ppm extends Model
{
    use HasFactory;

    protected $fillable = ['kode', 'deskripsi'];

    // Relasi balik ke CPL
    public function cpls()
    {
        return $this->belongsToMany(Cpl::class, 'cpl_ppm')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }

    // Relasi balik ke IEA
    public function ieas()
    {
        return $this->belongsToMany(Iea::class, 'ppm_iea')
                    ->withPivot('is_selected')
                    ->withTimestamps();
    }
}