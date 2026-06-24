import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

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
    kelas: Kelas;
}

interface Props {
    kelas: Kelas[];
    mahasiswas: Mahasiswa[];
    kelasId: number | null;
}

export default function AsesmenMahasiswa({ kelas, mahasiswas, kelasId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, reset, processing, errors } = useForm({
        nim: '',
        nama: '',
        kelas_id: kelasId?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/asesmen/mahasiswa', { onSuccess: () => { setIsOpen(false); reset(); } });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus mahasiswa ${nama}?`)) {
            router.delete(`/asesmen/mahasiswa/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Mahasiswa" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Manajemen Mahasiswa</h2>
                    <p className="text-gray-500 text-sm mt-1">Kelola data mahasiswa per kelas.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-polman-primary hover:bg-polman-secondary text-white font-bold py-2.5 px-5 rounded-lg text-sm"
                >
                    + Tambah Mahasiswa
                </button>
            </div>

            {/* Filter Kelas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Filter Kelas</label>
                <select
                    className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                    value={kelasId ?? ''}
                    onChange={e => router.get('/asesmen/mahasiswa', { kelas_id: e.target.value })}
                >
                    <option value="">-- Pilih Kelas --</option>
                    {kelas.map(k => (
                        <option key={k.id} value={k.id}>
                            {k.kode_kelas} (Tingkat {k.tingkat})
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabel Mahasiswa */}
            {kelasId && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-polman-neutral">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-gray-500 uppercase text-xs">#</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-500 uppercase text-xs">NIM</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-500 uppercase text-xs">Nama</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-500 uppercase text-xs">Kelas</th>
                                <th className="px-6 py-4 text-right font-bold text-gray-500 uppercase text-xs">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mahasiswas.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada mahasiswa.</td></tr>
                            ) : mahasiswas.map((mhs, i) => (
                                <tr key={mhs.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-6 py-4 font-bold text-polman-primary">{mhs.nim}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{mhs.nama}</td>
                                    <td className="px-6 py-4 text-gray-600">{mhs.kelas?.kode_kelas}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <button
                                            onClick={() => router.visit(`/asesmen/mhs/${mhs.id}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Grafik
                                        </button>
                                        <button
                                            onClick={() => handleDelete(mhs.id, mhs.nama)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Tambah Mahasiswa */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <Dialog.Title className="font-bold text-xl text-gray-900 mb-4">Tambah Mahasiswa</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">NIM</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                                    placeholder="contoh: 220443001"
                                    value={data.nim}
                                    onChange={e => setData('nim', e.target.value)}
                                    required
                                />
                                {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                                    placeholder="Nama mahasiswa"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kelas</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                                    value={data.kelas_id}
                                    onChange={e => setData('kelas_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas.map(k => (
                                        <option key={k.id} value={k.id}>
                                            {k.kode_kelas} (Tingkat {k.tingkat})
                                        </option>
                                    ))}
                                </select>
                                {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-bold text-white bg-polman-primary hover:bg-polman-secondary rounded-lg disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}