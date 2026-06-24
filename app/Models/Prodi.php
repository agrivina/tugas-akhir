<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    protected $connection = 'central';

    protected $fillable = [
        'kode',
        'nama',
        'tenant_id',
    ];
}
