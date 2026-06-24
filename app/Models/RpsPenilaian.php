<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsPenilaian extends Model
{
    protected $fillable = ['rps_id', 'cpmk_id', 'quiz', 'tugas', 'project', 'uts', 'uas'];

    public function rps()
    {
        return $this->belongsTo(Rps::class);
    }

    public function cpmk()
    {
        return $this->belongsTo(Cpmk::class);
    }
}