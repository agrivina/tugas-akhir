<?php

namespace App\Http\Controllers;

use App\Models\Cpl;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CplController extends Controller
{
    public function index()
    {
        return Inertia::render('Cpl/page', [
            'cpls' => Cpl::orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);

        // Ambil count data untuk generate kode selanjutnya
        $count = Cpl::count();
        $kode = 'CPL-' . str_pad($count + 1, 2, '0', STR_PAD_LEFT);

        Cpl::create([
            'kode' => $kode,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'CPL berhasil ditambahkan!');
    }

    public function update(Request $request, Cpl $cpl)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);
        
        $cpl->update(['deskripsi' => $request->deskripsi]);

        return redirect()->back()->with('success', 'Deskripsi CPL berhasil diubah!');
    }

    public function destroy(Cpl $cpl)
    {
        $cpl->delete(); // Relasi di pivot cpl_iea akan otomatis hilang karena cascade
        return redirect()->back()->with('success', 'CPL berhasil dihapus!');
    }
    
}