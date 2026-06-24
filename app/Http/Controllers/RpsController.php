<?php

namespace App\Http\Controllers;

use App\Models\Rps;
use App\Models\MataKuliah;
use App\Models\DosenBiodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Validation\Rule;

class RpsController extends Controller
{
    public function index()
    {
        $rps = Rps::with(['mataKuliah:id,kode_mk,nama_mk', 'penilaians', 'details'])->get();
        
        $rps->each(function ($item) {
            if ($item->dosen_biodata_id) {
                // 🔥 FIX: Pakai snake_case agar terbaca di page.tsx React
                $item->dosen_biodata = DosenBiodata::find($item->dosen_biodata_id);
            }
        });
        
        $mataKuliahs = MataKuliah::select('id', 'kode_mk', 'nama_mk')->get();
        $allDosen = DosenBiodata::orderBy('nama_lengkap')->get();

        return Inertia::render('Rps/page', [
            'rps' => $rps,
            'mataKuliahs' => $mataKuliahs,
            'allDosen' => $allDosen,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRps($request);

        try {
            DB::transaction(function () use ($validated, $request) {
                $rps = Rps::create([
                    'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                    'dosen_biodata_id'   => $validated['dosen_biodata_id'],
                    'tahun_akademik'     => $validated['tahun_akademik'],
                    'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                    'pustaka_utama'      => $validated['pustaka_utama'],
                    'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
                    'bahan_kajian_utama' => $validated['bahan_kajian_utama'],
                    'tte_dosen'          => $request->hasFile('tte_dosen') ? $request->file('tte_dosen')->store('rps_tte', 'public') : null,
                    'tte_kaprodi'        => $request->hasFile('tte_kaprodi') ? $request->file('tte_kaprodi')->store('rps_tte', 'public') : null,
                    'tte_kajur'          => $request->hasFile('tte_kajur') ? $request->file('tte_kajur')->store('rps_tte', 'public') : null,
                    'kode_dokumen'       => $validated['kode_dokumen'],
                ]);

                $rps->penilaians()->createMany($validated['penilaians']);
                $rps->details()->createMany($validated['details']);
            });

            return redirect()->route('rps.index')->with('success', 'RPS berhasil ditempa.');
            
        } catch (\Exception $e) {
            return back()->withErrors(['dosen_biodata_id' => 'SISTEM GAGAL MENYIMPAN: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $rps = Rps::findOrFail($id);
        $validated = $this->validateRps($request, true);

        try {
            DB::transaction(function () use ($validated, $request, $rps) {
                $data = [
                    'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                    'dosen_biodata_id'   => $validated['dosen_biodata_id'],
                    'tahun_akademik'     => $validated['tahun_akademik'],
                    'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                    'pustaka_utama'      => $validated['pustaka_utama'],
                    'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
                    'bahan_kajian_utama' => $validated['bahan_kajian_utama'],
                    'kode_dokumen'       => $validated['kode_dokumen'],
                ];

                // Cek dan ganti masing-masing TTE jika ada file baru
                $ttes = ['tte_dosen', 'tte_kaprodi', 'tte_kajur'];
                foreach ($ttes as $tte) {
                    if ($request->hasFile($tte)) {
                        if ($rps->$tte) Storage::disk('public')->delete($rps->$tte);
                        $data[$tte] = $request->file($tte)->store('rps_tte', 'public');
                    }
                }

                $rps->update($data);

                $rps->penilaians()->delete();
                $rps->penilaians()->createMany($validated['penilaians']);

                $rps->details()->delete();
                $rps->details()->createMany($validated['details']);
            });

            return redirect()->route('rps.index')->with('success', 'RPS berhasil diperbarui.');
            
        } catch (\Exception $e) {
             return back()->withErrors(['dosen_biodata_id' => 'SISTEM GAGAL UPDATE: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $rps = Rps::findOrFail($id);

        // Hapus ketiga file fisiknya
        $ttes = ['tte_dosen', 'tte_kaprodi', 'tte_kajur'];
        foreach ($ttes as $tte) {
            if ($rps->$tte) Storage::disk('public')->delete($rps->$tte);
        }
        
        $rps->delete(); 
        
        return redirect()->back()->with('success', 'RPS berhasil dilenyapkan.');
    }

    private function validateRps(Request $request, $isUpdate = false)
    {
        $tteRule = $isUpdate ? 'nullable' : 'required';

        return $request->validate([
            'mata_kuliah_id'     => 'required|exists:mata_kuliahs,id',
            // 🔥 FIX: Multi-Tenant Rule
            'dosen_biodata_id'   => ['nullable', Rule::exists(DosenBiodata::class, 'id')],
            'tahun_akademik'     => 'required|string|max:20',
            'tanggal_penyusunan' => 'required|date',
            'pustaka_utama'      => 'required|string',
            'pustaka_pendukung'  => 'nullable|string',
            'bahan_kajian_utama' => 'required|string',
            'tte_dosen'          => "nullable|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'tte_kaprodi'        => "nullable|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'tte_kajur'          => "nullable|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'kode_dokumen'       => 'required|string',
            
            'penilaians'           => 'required|array',
            'penilaians.*.cpmk_id' => 'required|exists:cpmks,id',
            'penilaians.*.quiz'    => 'numeric|min:0|max:100',
            'penilaians.*.tugas'   => 'numeric|min:0|max:100',
            'penilaians.*.project' => 'numeric|min:0|max:100',
            'penilaians.*.uts'     => 'numeric|min:0|max:100',
            'penilaians.*.uas'     => 'numeric|min:0|max:100',

            'details'                        => 'required|array',
            'details.*.pertemuan_ke'         => 'required|string|max:10',
            'details.*.kemampuan_akhir'      => 'required|string',
            'details.*.indikator'            => 'required|string',
            'details.*.bahan_kajian'         => 'required|string',
            'details.*.metode_pembelajaran'  => 'required|string',
            'details.*.estimasi_waktu'       => 'required|string',
            'details.*.pengalaman_belajar'   => 'nullable|string',
            'details.*.penilaian_komponen'   => 'nullable|string',
            'details.*.penilaian_bobot'      => 'numeric|min:0|max:100',
        ]);
    }

    // BUKA DI BROWSER (Preview)
// Contoh pada fungsi cetak atau download PDF di RpsController Anda:
/**
     * Fungsi untuk mencetak atau melihat preview PDF RPS
     */
    public function printPdf($id)
    {
        // 1. Load data RPS beserta relasi yang diperlukan 
        // Catatan: 'dosenBiodata' tidak dimasukkan di sini karena di model Rps.php dia adalah Accessor, bukan relasi Eloquent standar.
        $rps = Rps::with([
            'mataKuliah.cpmks.indikatorKinerjas.cpl', 
            'penilaians.cpmk', 
            'details',
            'mataKuliah.prasyarat'
        ])->findOrFail($id);

        // 2. Load data Dosen Pengampu secara manual untuk menghindari error relasi
        if ($rps->dosen_biodata_id) {
            $rps->dosen_biodata = DosenBiodata::find($rps->dosen_biodata_id);
        }

        // ==========================================
        // 1. LOGIC NAMA DOSEN PENGAMPU
        // ==========================================
        $dosen = $rps->dosen_biodata;
        $namaDosen = $dosen 
            ? trim(implode(' ', array_filter([$dosen->gelar_depan, $dosen->nama_lengkap, $dosen->gelar_belakang]))) 
            : '(................................)';

        // ==========================================
        // 2. LOGIC NAMA KAJUR
        // Mencari dosen dengan jabatan akademik 'Kajur'
        // ==========================================
        $kajur = DosenBiodata::where('jabatan_akademik', 'Kajur')->first();
        $namaKajur = $kajur 
            ? trim(implode(' ', array_filter([$kajur->gelar_depan, $kajur->nama_lengkap, $kajur->gelar_belakang]))) 
            : '(................................)';

        // ==========================================
        // 3. LOGIC NAMA KAPRODI (DINAMIS)
        // Alur: Cek prodi_id dosen pengampu -> cari Kaprodi di prodi tersebut
        // ==========================================
        $kodeTenant = str_replace('RPS_', '', $rps->kode_dokumen); 
        
        $prodiMap = [
            'RPS_TRIN' => 'Teknologi Rekayasa Informatika Industri',
            'RPS_TRO'  => 'Teknologi Rekayasa Otomasi',
            'RPS_TRMO' => 'Teknologi Rekayasa Mekatronika',
            'RPS_TRSA' => 'Teknologi Rekayasa Sistem Aerial Nirawak',
        ];
        // Dapatkan nama panjang prodi-nya
        $namaProdiLengkap = $prodiMap[$rps->kode_dokumen] ?? '';

        // Query: Cari di tabel dosen_biodatas di mana kolom 'prodi' cocok dengan RPS ini
        $kaprodi = DosenBiodata::where('jabatan_akademik', 'Kaprodi')
            ->where(function ($query) use ($kodeTenant, $namaProdiLengkap) {
                // Mencari langsung ke kolom 'prodi'
                $query->where('prodi', $namaProdiLengkap)
                      ->orWhere('prodi', $kodeTenant)
                      ->orWhere('prodi', 'LIKE', '%' . $kodeTenant . '%');
            })->first();

        $namaKaprodi = $kaprodi 
            ? trim(implode(' ', array_filter([$kaprodi->gelar_depan, $kaprodi->nama_lengkap, $kaprodi->gelar_belakang]))) 
            : '(................................)';
        // ==========================================
        // 4. PENGATURAN DAN RENDER PDF
        // ==========================================
        $pdf = Pdf::loadView('pdf.rps', compact('rps', 'namaDosen', 'namaKajur', 'namaKaprodi'))
            ->setPaper('a4', 'landscape') // Menggunakan landscape agar tabel mingguan tidak terpotong
            ->setOptions([
                'isRemoteEnabled' => true, // WAJIB: Agar grafik QuickChart bisa muncul
                'isHtml5ParserEnabled' => true,
                'chroot' => [
                    public_path(),
                    storage_path('app/public') // WAJIB: Agar DomPDF bisa membaca file TTE di storage
                ],
            ]);

        // Stream untuk preview di browser, atau gunakan download() jika ingin langsung terunduh
        return $pdf->stream('RPS_' . $rps->mataKuliah->kode_mk . '.pdf');
    }
}