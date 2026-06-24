import React from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Rps {
    id: number;
    tahun_akademik: string;
    mk_nama: string;
    mk_kode: string;
    semester: number;
}

interface Kelas {
    id: number;
    kode_kelas: string;
    tingkat: number;
}

interface Props {
    rpsAll: Rps[];
    kelas: Kelas[];
}

export default function NilaiIndex({ rpsAll, kelas }: Props) {
    const [rpsId, setRpsId] = React.useState('');
    const [kelasId, setKelasId] = React.useState('');

    const handleBuka = () => {
        if (!rpsId || !kelasId) return alert('Pilih RPS dan Kelas terlebih dahulu!');
        router.get('/asesmen/nilai/form', { rps_id: rpsId, kelas_id: kelasId });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Input Nilai" />

            <div className="mb-6">
                <h2 className="font-headline font-bold text-2xl text-gray-900">Input Nilai Mahasiswa</h2>
                <p className="text-gray-500 text-sm mt-1">Pilih RPS dan kelas untuk menginput nilai per CPMK.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">RPS / Mata Kuliah</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                            value={rpsId}
                            onChange={e => setRpsId(e.target.value)}
                        >
                            <option value="">-- Pilih RPS --</option>
                            {rpsAll.map(r => (
                                <option key={r.id} value={r.id}>
                                    [Sem {r.semester}] {r.mk_nama} ({r.mk_kode}) — {r.tahun_akademik}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kelas</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                            value={kelasId}
                            onChange={e => setKelasId(e.target.value)}
                        >
                            <option value="">-- Pilih Kelas --</option>
                            {kelas.map(k => (
                                <option key={k.id} value={k.id}>
                                    {k.kode_kelas} (Tingkat {k.tingkat})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleBuka}
                        className="bg-polman-primary hover:bg-polman-secondary text-white font-bold py-2.5 px-6 rounded-lg text-sm"
                    >
                        Buka Form Input →
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}