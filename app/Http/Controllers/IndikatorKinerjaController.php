<?php

namespace App\Http\Controllers;

use App\Models\Cpl;
use App\Models\IndikatorKinerja;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndikatorKinerjaController extends Controller
{
    public function index()
    {
        return Inertia::render('IndikatorKinerja/page', [
            // Eager loading: Menarik data IK sekaligus dengan data CPL-nya
            'indikator_kinerjas' => IndikatorKinerja::with('cpl')->orderBy('kode', 'asc')->get(),
            
            // Mengirim data CPL murni HANYA id, kode, dan deskripsi untuk dropdown form
            'cpls' => Cpl::select('id', 'kode', 'deskripsi')->orderBy('kode', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        // Validasi Absolut: Mencegah injeksi data yang tidak valid
        $request->validate([
            'cpl_id' => 'required|exists:cpls,id',
            'kode' => 'required|string|unique:indikator_kinerjas,kode', // Misal: A-1, B-2
            'deskripsi' => 'required|string|min:5'
        ]);

        IndikatorKinerja::create([
            'cpl_id' => $request->cpl_id,
            'kode' => $request->kode,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'Indikator Kinerja berhasil ditambahkan!');
    }

    public function update(Request $request, IndikatorKinerja $indikatorKinerja)
    {
        $request->validate([
            'cpl_id' => 'required|exists:cpls,id',
            // Validasi unique dikecualikan untuk ID milik dirinya sendiri saat update
            'kode' => 'required|string|unique:indikator_kinerjas,kode,' . $indikatorKinerja->id,
            'deskripsi' => 'required|string|min:5'
        ]);

        $indikatorKinerja->update([
            'cpl_id' => $request->cpl_id,
            'kode' => $request->kode,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'Data Indikator Kinerja berhasil diperbarui!');
    }

    public function destroy(IndikatorKinerja $indikatorKinerja)
    {
        $indikatorKinerja->delete();
        return redirect()->back()->with('success', 'Indikator Kinerja berhasil dimusnahkan!');
    }
}