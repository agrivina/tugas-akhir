<?php

namespace App\Http\Controllers;

use App\Models\Iea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IeaController extends Controller
{
    public function index()
    {
        return Inertia::render('Iea/page', [
            'ieas' => Iea::orderBy('id', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);

        // Logika increment abjad PHP (A++ jadi B, Z++ jadi AA)
        $count = Iea::count();
        $letter = 'A';
        for ($i = 0; $i < $count; $i++) {
            $letter++;
        }

        Iea::create([
            'kode' => 'IEA_' . $letter,
            'deskripsi' => $request->deskripsi
        ]);

        return redirect()->back()->with('success', 'IEA berhasil ditambahkan!');
    }

    public function update(Request $request, Iea $iea)
    {
        $request->validate(['deskripsi' => 'required|string|min:5']);

        $iea->update(['deskripsi' => $request->deskripsi]);

        return redirect()->back()->with('success', 'Deskripsi IEA berhasil diubah!');
    }

    public function destroy(Iea $iea)
    {
        $iea->delete();
        return redirect()->back()->with('success', 'IEA berhasil dihapus!');
    }
}