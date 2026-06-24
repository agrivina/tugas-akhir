<?php

namespace App\Services;

use App\Models\NilaiMahasiswa;
use App\Models\CapaianCpl;
use App\Models\CapaianIea;
use Illuminate\Support\Facades\DB;

class AsesmenService
{
    public function hitungCapaian(int $mahasiswaId, int $rpsId, string $tahunAkademik): void
    {
        DB::transaction(function () use ($mahasiswaId, $rpsId, $tahunAkademik) {
            $this->hitungNilaiCpmk($mahasiswaId, $rpsId);
            $nilaiPerIk = $this->hitungNilaiIk($mahasiswaId, $rpsId);
            $this->hitungDanSimpanCpl($mahasiswaId, $rpsId, $nilaiPerIk, $tahunAkademik);
            $this->hitungDanSimpanIea($mahasiswaId, $tahunAkademik);
        });
    }

    private function hitungNilaiCpmk(int $mahasiswaId, int $rpsId): void
    {
        $rows = DB::table('nilai_mahasiswas')
            ->join('rps_penilaians', function ($j) use ($rpsId) {
                $j->on('rps_penilaians.cpmk_id', '=', 'nilai_mahasiswas.cpmk_id')
                  ->where('rps_penilaians.rps_id', $rpsId);
            })
            ->where('nilai_mahasiswas.mahasiswa_id', $mahasiswaId)
            ->where('nilai_mahasiswas.rps_id', $rpsId)
            ->select(
                'nilai_mahasiswas.id',
                DB::raw('(nilai_mahasiswas.quiz    * rps_penilaians.quiz
                        + nilai_mahasiswas.tugas   * rps_penilaians.tugas
                        + nilai_mahasiswas.project * rps_penilaians.project
                        + nilai_mahasiswas.uts     * rps_penilaians.uts
                        + nilai_mahasiswas.uas     * rps_penilaians.uas) / 100 AS nilai_hitung')
            )
            ->get();

        foreach ($rows as $row) {
            DB::table('nilai_mahasiswas')
                ->where('id', $row->id)
                ->update(['nilai_akhir_cpmk' => round($row->nilai_hitung, 2)]);
        }
    }

    private function hitungNilaiIk(int $mahasiswaId, int $rpsId): array
    {
        $rps = DB::table('rps')->where('id', $rpsId)->first();
        $sksMatkul = DB::table('mata_kuliahs')->where('id', $rps->mata_kuliah_id)->value('sks');

        $nilaiCpmk = DB::table('nilai_mahasiswas')
            ->where('mahasiswa_id', $mahasiswaId)
            ->where('rps_id', $rpsId)
            ->pluck('nilai_akhir_cpmk', 'cpmk_id');

        // Mapping CPMK -> IK via cpmk_indikator_kinerja
        $mappings = DB::table('cpmk_indikator_kinerja as cik')
            ->join('cpmks as c', 'c.id', '=', 'cik.cpmk_id')
            ->where('c.mata_kuliah_id', $rps->mata_kuliah_id)
            ->select('cik.cpmk_id', 'cik.indikator_kinerja_id')
            ->get();

        $nilaiPerIk = [];
        foreach ($mappings as $map) {
            $ikId = $map->indikator_kinerja_id;
            $nilaiCpmkIni = $nilaiCpmk[$map->cpmk_id] ?? 0;

            // Total SKS semua MK yang mendukung IK ini
            $totalSks = DB::table('cpmk_indikator_kinerja as cik')
                ->join('cpmks as c', 'c.id', '=', 'cik.cpmk_id')
                ->join('mata_kuliahs as mk', 'mk.id', '=', 'c.mata_kuliah_id')
                ->where('cik.indikator_kinerja_id', $ikId)
                ->sum('mk.sks');

            if ($totalSks == 0) continue;

            $bobot = $sksMatkul / $totalSks;
            $nilaiPerIk[$ikId] = ($nilaiPerIk[$ikId] ?? 0) + ($nilaiCpmkIni * $bobot);
        }

        return $nilaiPerIk;
    }

    private function hitungDanSimpanCpl(
        int $mahasiswaId, int $rpsId, array $nilaiPerIk, string $tahunAkademik
    ): void {
        $rps = DB::table('rps')->where('id', $rpsId)->first();
        $semester = DB::table('mata_kuliahs')
            ->where('id', $rps->mata_kuliah_id)->value('semester');

        $ikIds = array_keys($nilaiPerIk);
        if (empty($ikIds)) return;

        $cplIds = DB::table('indikator_kinerjas')
            ->whereIn('id', $ikIds)->pluck('cpl_id')->unique();

        foreach ($cplIds as $cplId) {
            $ikMilikCpl = DB::table('indikator_kinerjas')
                ->where('cpl_id', $cplId)->pluck('id');

            $nilaiList = [];
            foreach ($ikMilikCpl as $ikId) {
                if (isset($nilaiPerIk[$ikId])) {
                    $nilaiList[] = $nilaiPerIk[$ikId];
                }
            }
            if (empty($nilaiList)) continue;

            $nilaiCpl = round(array_sum($nilaiList) / count($nilaiList), 2);

            DB::table('capaian_cpls')->updateOrInsert(
                ['mahasiswa_id'=>$mahasiswaId,'cpl_id'=>$cplId,
                 'semester'=>$semester,'tahun_akademik'=>$tahunAkademik],
                ['nilai'=>$nilaiCpl,'tercapai'=>$nilaiCpl>=55,
                 'updated_at'=>now(),'created_at'=>now()]
            );
        }
    }

    private function hitungDanSimpanIea(int $mahasiswaId, string $tahunAkademik): void
    {
        $semesters = DB::table('capaian_cpls')
            ->where('mahasiswa_id', $mahasiswaId)
            ->where('tahun_akademik', $tahunAkademik)
            ->pluck('semester')->unique();

        $ieaIds = DB::table('ieas')->pluck('id');

        foreach ($semesters as $semester) {
            $nilaiCpl = DB::table('capaian_cpls')
                ->where('mahasiswa_id', $mahasiswaId)
                ->where('semester', $semester)
                ->where('tahun_akademik', $tahunAkademik)
                ->pluck('nilai', 'cpl_id');

            foreach ($ieaIds as $ieaId) {
                // Mapping CPL -> IEA via cpl_iea
                $cplMapped = DB::table('cpl_iea')
                    ->where('iea_id', $ieaId)
                    ->pluck('cpl_id');

                $nilaiList = [];
                foreach ($cplMapped as $cplId) {
                    if (isset($nilaiCpl[$cplId])) {
                        $nilaiList[] = $nilaiCpl[$cplId];
                    }
                }
                if (empty($nilaiList)) continue;

                $nilaiIea = round(array_sum($nilaiList) / count($nilaiList), 2);

                DB::table('capaian_ieas')->updateOrInsert(
                    ['mahasiswa_id'=>$mahasiswaId,'iea_id'=>$ieaId,
                     'semester'=>$semester,'tahun_akademik'=>$tahunAkademik],
                    ['nilai'=>$nilaiIea,'updated_at'=>now(),'created_at'=>now()]
                );
            }
        }
    }

    public function getDataGrafik(int $mahasiswaId): array
    {
        $mahasiswa = DB::table('mahasiswas')
            ->join('kelas','kelas.id','=','mahasiswas.kelas_id')
            ->select('mahasiswas.*','kelas.kode_kelas','kelas.tingkat')
            ->where('mahasiswas.id', $mahasiswaId)->first();

        $cpls = DB::table('cpls')->orderBy('kode')->get();
        $ieas = DB::table('ieas')->orderBy('kode')->get();

        // Bar chart: nilai CPL per semester (1-8)
        $grafikCpl = [];
        foreach ($cpls as $cpl) {
            $data = [];
            for ($sem = 1; $sem <= 8; $sem++) {
                $data[] = (float)(DB::table('capaian_cpls')
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('cpl_id', $cpl->id)
                    ->where('semester', $sem)
                    ->value('nilai') ?? 0);
            }
            $grafikCpl[] = [
                'label' => $cpl->kode,
                'deskripsi' => $cpl->deskripsi,
                'data' => $data
            ];
        }

        // Radar CPL: nilai maksimal per CPL
        $radarCpl = [];
        foreach ($cpls as $cpl) {
            $radarCpl[] = [
                'label' => $cpl->kode,
                'nilai' => (float)(DB::table('capaian_cpls')
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('cpl_id', $cpl->id)
                    ->max('nilai') ?? 0),
            ];
        }

        // Grafik IEA per semester
        $grafikIea = [];
        foreach ($ieas as $iea) {
            $data = [];
            for ($sem = 1; $sem <= 8; $sem++) {
                $avg = DB::table('capaian_ieas')
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('iea_id', $iea->id)
                    ->where('semester', $sem)
                    ->value('nilai');
                $data[] = $avg ? round((float)$avg, 2) : 0;
            }
            $grafikIea[] = [
                'label' => $iea->kode,
                'deskripsi' => $iea->deskripsi,
                'data' => $data,
            ];
        }


        // Radar IEA
        $radarIea = [];
        foreach ($ieas as $iea) {
            $radarIea[] = [
                'label' => '('.$iea->kode.') '.$iea->deskripsi,
                'nilai' => (float)(DB::table('capaian_ieas')
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('iea_id', $iea->id)
                    ->max('nilai') ?? 0),
            ];
        }

        // IPS per semester
        $ips = [];
        for ($sem = 1; $sem <= 8; $sem++) {
            $avg = DB::table('capaian_cpls')
                ->where('mahasiswa_id', $mahasiswaId)
                ->where('semester', $sem)
                ->avg('nilai');
            $ips[] = $avg ? round($avg, 2) : 0;
        }

        // PPM
        $ppms = DB::table('ppms')->orderBy('kode')->get();
        $grafikPpm = [];
        foreach ($ppms as $ppm) {
            // Ambil CPL yang mapped ke PPM via IEA
            $ieaIds = DB::table('ppm_iea')
                ->where('ppm_id', $ppm->id)->pluck('iea_id');
            $cplIds = DB::table('cpl_iea')
                ->whereIn('iea_id', $ieaIds)->pluck('cpl_id')->unique();
            $nilaiList = [];
            foreach ($cplIds as $cplId) {
                $n = DB::table('capaian_cpls')
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('cpl_id', $cplId)
                    ->max('nilai');
                if ($n) $nilaiList[] = $n;
            }
            $grafikPpm[] = [
                'kode' => $ppm->kode,
                'deskripsi' => $ppm->deskripsi,
                'nilai' => count($nilaiList) > 0
                    ? round(array_sum($nilaiList)/count($nilaiList), 2)
                    : 0,
            ];
        }

        return compact(
            'mahasiswa','grafikCpl','radarCpl',
            'grafikIea','radarIea','ips','grafikPpm','cpls','ieas','ppms'
        );
    }
}