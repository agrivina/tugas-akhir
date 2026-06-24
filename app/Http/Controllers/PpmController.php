<?php

namespace App\Http\Controllers;

use App\Models\Ppm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpmController extends Controller
{
    public function index()
    {
        return Inertia::render('Ppm/page', [
            'ppms' => Ppm::orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);

        $count = Ppm::count();
        $kode = 'PPM-' . str_pad($count + 1, 2, '0', STR_PAD_LEFT);

        Ppm::create([
            'kode' => $kode,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'PPM berhasil ditambahkan!');
    }

    public function update(Request $request, Ppm $ppm)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);

        $ppm->update(['deskripsi' => $request->deskripsi]);

        return redirect()->back()->with('success', 'Deskripsi PPM berhasil diubah!');
    }

    public function destroy(Ppm $ppm)
    {
        $ppm->delete();
        return redirect()->back()->with('success', 'PPM berhasil dihapus!');
    }
}