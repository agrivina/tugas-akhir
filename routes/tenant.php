<?php

declare(strict_types=1);

use App\Http\Controllers\CplController;
use App\Http\Controllers\CpmkController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DosenBiodataController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\IeaController;
use App\Http\Controllers\IndikatorKinerjaController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\MatrixController;
use App\Http\Controllers\PpmController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RpsController;
use App\Http\Controllers\AsesmenController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    require __DIR__.'/auth.php';

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::middleware(['auth', 'role:Kaprodi|Dosen'])->group(function () {
        Route::resource('rps', RpsController::class)->except(['show']);
        Route::get('/rps/{id}/pdf', [RpsController::class, 'printPdf'])->name('rps.pdf');
        Route::get('/rps/{id}/download', [RpsController::class, 'downloadPdf'])->name('rps.download');
        Route::get('/matrix', [MatrixController::class, 'index'])->name('matrix.index');

        // Input nilai
        Route::get('/asesmen/nilai', [AsesmenController::class, 'nilaiIndex'])->name('asesmen.nilai');
        Route::get('/asesmen/nilai/form', [AsesmenController::class, 'nilaiForm'])->name('asesmen.nilai.form');
        Route::post('/asesmen/nilai', [AsesmenController::class, 'nilaiStore'])->name('asesmen.nilai.store');
        
        Route::resource('biodata-dosen', DosenBiodataController::class)
            ->parameters(['biodata-dosen' => 'dosenBiodata'])
            ->only(['index']);

        // Dashboard grafik
        Route::get('/asesmen', [AsesmenController::class, 'index'])->name('asesmen.index');
        Route::get('/asesmen/mhs/{id}', [AsesmenController::class, 'show'])->name('asesmen.show');
        Route::get('/asesmen/rerata', [AsesmenController::class, 'rerata'])->name('asesmen.rerata');

        // Dosen kelola profil/biodata sendiri
        Route::get('/biodata-saya', [DosenBiodataController::class, 'showSelf'])->name('biodata-saya.show');
        Route::patch('/biodata-saya', [DosenBiodataController::class, 'updateSelf'])->name('biodata-saya.update');
    });

    Route::middleware(['auth', 'role:Kaprodi'])->group(function () {
        Route::resource('mata-kuliah', MataKuliahController::class)->except(['create', 'show', 'edit']);
        Route::get('/mata-kuliah/{id}/rps-data', [MataKuliahController::class, 'apiGetRpsData'])->name('mata-kuliah.rps-data');

        Route::resource('biodata-dosen', DosenBiodataController::class)
            ->parameters(['biodata-dosen' => 'dosenBiodata'])
            ->only([ 'store', 'update', 'destroy']);

        Route::get('/mata-kuliah/{id}/dosen-pengampu', [MataKuliahController::class, 'dosenPengampu'])->name('mata-kuliah.dosen-pengampu');
        Route::post('/mata-kuliah/{id}/dosen-pengampu', [MataKuliahController::class, 'attachDosen'])->name('mata-kuliah.attach-dosen');
        Route::delete('/mata-kuliah/{mkId}/dosen-pengampu/{dosenId}', [MataKuliahController::class, 'detachDosen'])->name('mata-kuliah.detach-dosen');

        Route::get('/dosen', [DosenController::class, 'index'])->name('dosen.index');
        Route::get('/dosen/create', [DosenController::class, 'create'])->name('dosen.create');
        Route::post('/dosen', [DosenController::class, 'store'])->name('dosen.store');

        Route::resource('indikator-kinerja', IndikatorKinerjaController::class)->except(['create', 'show', 'edit']);

        Route::get('/cpl', [CplController::class, 'index'])->name('cpl.index');
        Route::post('/cpl', [CplController::class, 'store'])->name('cpl.store');
        Route::patch('/cpl/{cpl}', [CplController::class, 'update'])->name('cpl.update');
        Route::delete('/cpl/{cpl}', [CplController::class, 'destroy'])->name('cpl.destroy');

        Route::get('/ppm', [PpmController::class, 'index'])->name('ppm.index');
        Route::post('/ppm', [PpmController::class, 'store'])->name('ppm.store');
        Route::patch('/ppm/{ppm}', [PpmController::class, 'update'])->name('ppm.update');
        Route::delete('/ppm/{ppm}', [PpmController::class, 'destroy'])->name('ppm.destroy');

        Route::get('/iea', [IeaController::class, 'index'])->name('iea.index');
        Route::post('/iea', [IeaController::class, 'store'])->name('iea.store');
        Route::patch('/iea/{iea}', [IeaController::class, 'update'])->name('iea.update');
        Route::delete('/iea/{iea}', [IeaController::class, 'destroy'])->name('iea.destroy');

        Route::post('/matrix/bulk-sync', [MatrixController::class, 'syncCplBulk'])->name('matrix.sync.bulk');
        Route::post('/matrix/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync-cpl-iea');
        Route::post('/matrix/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync-ppm-iea');
        Route::post('/matrix/sync-mk-cpl', [MatrixController::class, 'syncMkCpl'])->name('matrix.sync-mk-cpl');

        Route::prefix('cpmk')->group(function () {
            Route::get('/mk/{mata_kuliah_id}', [CpmkController::class, 'index'])->name('cpmk.index');
            Route::post('/', [CpmkController::class, 'store'])->name('cpmk.store');
            Route::put('/{cpmk}', [CpmkController::class, 'update'])->name('cpmk.update');
            Route::patch('/{cpmk}', [CpmkController::class, 'update']);
            Route::delete('/{cpmk}', [CpmkController::class, 'destroy'])->name('cpmk.destroy');
        });

        // ── ASESMEN CPL ──────────────────────────────────────────────
        // Kelas
        Route::get('/asesmen/kelas', [AsesmenController::class, 'kelasIndex'])->name('asesmen.kelas');
        Route::post('/asesmen/kelas', [AsesmenController::class, 'kelasStore'])->name('asesmen.kelas.store');
        Route::delete('/asesmen/kelas/{id}', [AsesmenController::class, 'kelasDestroy'])->name('asesmen.kelas.destroy');

        // Mahasiswa
        Route::get('/asesmen/mahasiswa', [AsesmenController::class, 'mahasiswaIndex'])->name('asesmen.mahasiswa');
        Route::post('/asesmen/mahasiswa', [AsesmenController::class, 'mahasiswaStore'])->name('asesmen.mahasiswa.store');
        Route::delete('/asesmen/mahasiswa/{id}', [AsesmenController::class, 'mahasiswaDestroy'])->name('asesmen.mahasiswa.destroy');

        

    });
});
