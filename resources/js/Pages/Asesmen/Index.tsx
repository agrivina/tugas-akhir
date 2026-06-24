import React from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Kelas {
    id: number;
    kode_kelas: string;
    tingkat: number;
    tahun_masuk: string;
}

interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    kelas_id: number;
}

interface Props {
    kelasList: Kelas[];
    mahasiswas: Mahasiswa[];
    kelasId: number | null;
}

export default function AsesmenIndex({ kelasList, mahasiswas, kelasId }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Asesmen CPL" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Dashboard Asesmen CPL</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Pilih kelas dan mahasiswa untuk melihat grafik capaian CPL.</p>
                </div>
            </div>

            {/* Filter Kelas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 font-body">
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Kelas</label>
                <select
                    className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                    value={kelasId ?? ''}
                    onChange={e => router.get('/asesmen', { kelas_id: e.target.value })}
                >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map(k => (
                        <option key={k.id} value={k.id}>
                            {k.kode_kelas} (Tingkat {k.tingkat} — {k.tahun_masuk})
                        </option>
                    ))}
                </select>
            </div>

            {/* Daftar Mahasiswa */}
            {mahasiswas.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mahasiswas.map(mhs => (
                        <button
                            key={mhs.id}
                            onClick={() => router.visit(`/asesmen/mhs/${mhs.id}`)}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:border-polman-primary hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 text-xl font-bold text-polman-primary">
                                {mhs.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-bold text-sm text-gray-800">{mhs.nama}</div>
                            <div className="text-xs text-gray-500 mt-1">{mhs.nim}</div>
                        </button>
                    ))}
                </div>
            ) : kelasId ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-500">
                    Belum ada mahasiswa di kelas ini.
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
                    Pilih kelas untuk melihat daftar mahasiswa.
                </div>
            )}
        </AuthenticatedLayout>
    );
}