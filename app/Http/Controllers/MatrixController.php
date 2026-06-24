<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cpl;
use App\Models\Iea;
use App\Models\Ppm;
use App\Models\MataKuliah; // PUSAKA BARU: Memanggil entitas MK

class MatrixController extends Controller
{
    public function index()
    {
        // Menarik semua entitas beserta relasinya
        $cpls = Cpl::with('ieas')->get(); 
        $ppms = Ppm::with('ieas')->get();
        $ieas = Iea::all();
        $mataKuliahs = MataKuliah::with('cpls')->get(); // PUSAKA BARU: Menarik silsilah MK & CPL

        // 1. Matriks Otomatis CPL to PPM (Berdasarkan irisan IEA)
        $ppmIeaMap = [];
        foreach ($ppms as $ppm) {
            $ppmIeaMap[$ppm->id] = $ppm->ieas->pluck('id')->toArray();
        }

        $cplToPpmMatrix = [];
        foreach ($cpls as $cpl) {
            $cplIeaIds = $cpl->ieas->pluck('id')->toArray();
            foreach ($ppms as $ppm) {
                $intersection = array_intersect($cplIeaIds, $ppmIeaMap[$ppm->id]);
                $cplToPpmMatrix[$cpl->id][$ppm->id] = !empty($intersection);
            }
        }

        return Inertia::render('Matrix/Page', [
            'cpls' => $cpls,
            'ieas' => $ieas,
            'ppms' => $ppms,
            'mataKuliahs' => $mataKuliahs, // PUSAKA BARU: Dikirim ke Front-end
            'cplToPpmMatrix' => $cplToPpmMatrix
        ]);
    }

    // Mantra Pengikat CPL & IEA
    public function syncCplIea(Request $request)
    {
        $request->validate([
            'cpl_id' => 'required|exists:cpls,id',
            'iea_id' => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $cpl = Cpl::findOrFail($request->cpl_id);
        $request->is_selected ? 
            $cpl->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]) : 
            $cpl->ieas()->detach($request->iea_id);

        return redirect()->back();
    }

    // Mantra Pengikat PPM & IEA
    public function syncPpmIea(Request $request)
    {
        $request->validate([
            'ppm_id' => 'required|exists:ppms,id',
            'iea_id' => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $ppm = Ppm::findOrFail($request->ppm_id);
        $request->is_selected ? 
            $ppm->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]) : 
            $ppm->ieas()->detach($request->iea_id);

        return redirect()->back();
    }

    // PUSAKA BARU: Mantra Pengikat Mata Kuliah & CPL (Matriks Kurikulum Utama)
    public function syncMkCpl(Request $request)
    {
        $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'cpl_id' => 'required|exists:cpls,id',
            'is_selected' => 'required|boolean',
            'bobot' => 'nullable|integer' // Opsional jika paduka menggunakan bobot 1-4
        ]);

        $mk = MataKuliah::findOrFail($request->mata_kuliah_id);
        
        if ($request->is_selected) {
            $mk->cpls()->syncWithoutDetaching([
                $request->cpl_id => ['bobot' => $request->bobot ?? 0]
            ]);
        } else {
            $mk->cpls()->detach($request->cpl_id);
        }

        return redirect()->back()->with('success', 'Ikatan Mata Kuliah dan CPL telah diperbarui.');
    }
}