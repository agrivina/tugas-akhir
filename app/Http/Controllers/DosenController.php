<?php

namespace App\Http\Controllers;

use App\Models\DosenBiodata;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function index()
    {
        $dosens = User::role('Dosen')->get();
        
        $dosens->each(function ($user) {
            if ($user->dosen_biodata_id) {
                $user->dosenBiodata = DosenBiodata::find($user->dosen_biodata_id);
            }
        });
        
        return Inertia::render('Dosen/Index', [
            'dosens' => $dosens
        ]);
    }

    public function create()
    {
        // Ambil semua ID dosen yang sudah punya akun di tenant DB
        $usedIds = User::whereNotNull('dosen_biodata_id')
            ->pluck('dosen_biodata_id')
            ->toArray();

        // Filter di central: ambil yang ID-nya belum dipakai
        $biodatas = DosenBiodata::whereNotIn('id', $usedIds)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'gelar_depan', 'gelar_belakang', 'nip', 'email']);

        return Inertia::render('Dosen/Create', [
            'biodatas' => $biodatas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dosen_biodata_id' => [
                'required',
                'exists:dosen_biodatas,id', // ← tambah 'central.'
                Rule::unique('users', 'dosen_biodata_id'),
            ],
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
        $biodata = DosenBiodata::findOrFail($validated['dosen_biodata_id']);

        $user = User::create([
            'dosen_biodata_id' => $biodata->id,
            'name' => trim(implode(' ', array_filter([
                $biodata->gelar_depan,
                $biodata->nama_lengkap,
                $biodata->gelar_belakang,
            ]))),
            'email' => $validated['email'],
            'nip' => $biodata->nip,
            'password' => Hash::make($validated['password']),
        ]);

        // Suntikkan Role Dosen
        $user->assignRole('Dosen');

        // Redirect ke tabel daftar dosen
        return redirect()->route('dosen.index')->with('success', 'Akun Dosen berhasil didaftarkan.');
    }
}
