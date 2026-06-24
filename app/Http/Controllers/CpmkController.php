<?php

namespace App\Http\Controllers;

use App\Models\Cpmk;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CpmkController extends Controller
{
    /**
     * Menampilkan daftar CPMK berdasarkan Mata Kuliah tertentu
     */
    public function index(string $mataKuliahId)
    {
        // PERBAIKAN 1: Tambahkan 'cpls.indikatorKinerjas' agar data CPL ikut ditarik
        $mk = MataKuliah::with([
            'cpls.indikatorKinerjas', 
            'cpmks.indikatorKinerjas'
        ])->findOrFail($mataKuliahId);

        return Inertia::render('Cpmk/page', [
            'mataKuliah' => $mk,
            // PERBAIKAN 2: Frontend membutuhkan 'existingCpmks', bukan 'allIndikators'
            'existingCpmks' => $mk->cpmks 
        ]);
    }

    /**
     * Menempa CPMK baru dan mengikatnya dengan Indikator Kinerja
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'kode_cpmk' => 'required|string',
            'deskripsi' => 'required|string',
            'indikator_ids' => 'required|array', // Array ID Indikator Kinerja
            'indikator_ids.*' => 'exists:indikator_kinerjas,id'
        ]);

        $cpmk = Cpmk::create([
            'mata_kuliah_id' => $validated['mata_kuliah_id'],
            'kode_cpmk' => $validated['kode_cpmk'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        // Ritual pengikatan Many-to-Many
        $cpmk->indikatorKinerjas()->sync($validated['indikator_ids']);

        return redirect()->back()->with('success', 'CPMK telah berhasil ditempa dan diikat pada Indikator.');
    }

    /**
     * PERBAIKAN 3: Menambahkan fungsi update agar tombol Edit berfungsi
     */
    public function update(Request $request, Cpmk $cpmk)
    {
        $validated = $request->validate([
            'kode_cpmk' => 'required|string',
            'deskripsi' => 'required|string',
            'indikator_ids' => 'required|array',
            'indikator_ids.*' => 'exists:indikator_kinerjas,id'
        ]);

        $cpmk->update([
            'kode_cpmk' => $validated['kode_cpmk'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        // Sinkronisasi ulang relasi Many-to-Many
        $cpmk->indikatorKinerjas()->sync($validated['indikator_ids']);

        return redirect()->back()->with('success', 'CPMK telah berhasil diperbarui.');
    }

    /**
     * Melenyapkan CPMK dari sejarah
     */
    public function destroy(Cpmk $cpmk)
    {
        $cpmk->delete();
        return redirect()->back()->with('success', 'CPMK telah dilenyapkan.');
    }
}