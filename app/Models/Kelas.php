<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model {
    protected $table = 'kelas';
    protected $fillable = ['kode_kelas', 'tingkat', 'tahun_masuk'];

    public function mahasiswas() {
        return $this->hasMany(Mahasiswa::class);
    }
}