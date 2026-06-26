import React, { useState } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

interface MataKuliah {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    jenis: 'Teori' | 'Praktek';
    deskripsi: string | null;
    semester: string | null;
    sifat_pengambilan: string | null;
    cara_pembelajaran: string | null;
    prasyarat_id: number | null;
    prasyarat?: { kode_mk: string; nama_mk: string } | null;
}

export default function MataKuliahIndex({ mataKuliahs }: { mataKuliahs: MataKuliah[] }) {
    const { roles } = usePage().props.auth as any;
    const isKaprodi = roles?.includes('Kaprodi');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    const filtered = mataKuliahs.filter((mk) =>
        mk.kode_mk.toLowerCase().includes(search.toLowerCase()) ||
        mk.nama_mk.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (val: string) => { setSearch(val); setPage(1); };

    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        kode_mk: '',
        nama_mk: '',
        sks: '',
        jenis: 'Teori',
        semester: '',
        sifat_pengambilan: 'Wajib',
        cara_pembelajaran: 'Tatap Muka',
        deskripsi: '',
        prasyarat_id: '' as string | number | null,
    });

    const openAddModal = () => {
        setModalMode('add');
        reset(); 
        clearErrors();
        setData({
            kode_mk: '',
            nama_mk: '',
            sks: '',
            jenis: 'Teori',
            semester: '',
            sifat_pengambilan: 'Wajib',
            cara_pembelajaran: 'Tatap Muka',
            deskripsi: '',
            prasyarat_id: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (mk: MataKuliah) => {
        setModalMode('edit');
        setSelectedId(mk.id);
        setData({
            kode_mk: mk.kode_mk,
            nama_mk: mk.nama_mk,
            sks: mk.sks.toString(),
            jenis: mk.jenis,
            semester: mk.semester || '',
            sifat_pengambilan: mk.sifat_pengambilan || 'Wajib',
            cara_pembelajaran: mk.cara_pembelajaran || 'Tatap Muka',
            deskripsi: mk.deskripsi || '',
            prasyarat_id: mk.prasyarat_id || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') post('/mata-kuliah', { onSuccess: () => setIsModalOpen(false) });
        else patch(`/mata-kuliah/${selectedId}`, { onSuccess: () => setIsModalOpen(false) });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mata Kuliah" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Mata Kuliah</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola data pusaka mata kuliah prodi.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari mata kuliah..."
                            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-polman-primary w-56"
                        />
                    </div>
                    {isKaprodi && (
                        <button onClick={openAddModal} className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-colors">
                            + Tambah Mata Kuliah
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Smt</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">SKS</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Sifat</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">
                                {search ? 'Tidak ada mata kuliah yang cocok.' : 'Belum ada data Mata Kuliah.'}
                            </td></tr>
                        ) : (
                            paginated.map((mk) => (
                                <tr key={mk.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-polman-primary">{mk.kode_mk}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {mk.nama_mk}
                                        <div className="text-xs text-gray-500 mt-1">{mk.jenis} • {mk.cara_pembelajaran}</div>
                                        {mk.prasyarat && (
                                            <div className="text-xs text-red-500 mt-1 font-bold">Prasyarat: {mk.prasyarat.nama_mk}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{mk.semester || '-'}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600">{mk.sks}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${mk.sifat_pengambilan === 'Wajib' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {mk.sifat_pengambilan || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/cpmk/mk/${mk.id}`} className="bg-polman-primary hover:bg-polman-secondary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                                Kelola CPMK
                                            </Link>
                                            {isKaprodi && (
                                                <Link href={`/mata-kuliah/${mk.id}/dosen-pengampu`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                                                    Kelola Dosen
                                                </Link>
                                            )}
                                            {isKaprodi && (
                                                <>
                                                    <button onClick={() => openEditModal(mk)} className="text-blue-600 hover:text-blue-800 font-bold px-2 text-sm transition-colors">Edit</button>
                                                    <button onClick={() => { if (confirm(`Hapus MK ${mk.kode_mk}?`)) router.delete(`/mata-kuliah/${mk.id}`); }} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm transition-colors">Hapus</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-bold">Halaman {page} dari {totalPages} ({filtered.length} mata kuliah)</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-black border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-polman-primary hover:text-white hover:border-polman-primary transition-all">
                                ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${p === page ? 'bg-polman-primary text-white' : 'border border-gray-200 text-gray-500 hover:border-polman-primary hover:text-polman-primary'}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg text-xs font-black border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-polman-primary hover:text-white hover:border-polman-primary transition-all">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl font-body overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">{modalMode === 'add' ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah'}</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kode MK <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Cth: MK-01, TRO-101" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.kode_mk} onChange={e => setData('kode_mk', e.target.value)} required />
                                    {errors.kode_mk && <p className="text-red-500 text-xs mt-1">{errors.kode_mk}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Mata Kuliah <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.nama_mk} onChange={e => setData('nama_mk', e.target.value)} required />
                                    {errors.nama_mk && <p className="text-red-500 text-xs mt-1">{errors.nama_mk}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bobot SKS <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.sks} onChange={e => setData('sks', e.target.value)} required />
                                    {errors.sks && <p className="text-red-500 text-xs mt-1">{errors.sks}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Semester</label>
                                    <input type="text" placeholder="Cth: 2 atau Ganjil" className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.semester} onChange={e => setData('semester', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Jenis MK <span className="text-red-500">*</span></label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.jenis} onChange={e => setData('jenis', e.target.value as 'Teori' | 'Praktek')}>
                                        <option value="Teori">Teori</option>
                                        <option value="Praktek">Praktek</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Sifat Pengambilan</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.sifat_pengambilan} onChange={e => setData('sifat_pengambilan', e.target.value)}>
                                        <option value="Wajib">Wajib</option>
                                        <option value="Pilihan">Pilihan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cara Pembelajaran</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" value={data.cara_pembelajaran} onChange={e => setData('cara_pembelajaran', e.target.value)}>
                                        <option value="Tatap Muka">Tatap Muka</option>
                                        <option value="Daring">Daring</option>
                                        <option value="Bauran (Blended)">Bauran (Blended)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Prasyarat</label>
                                    <select 
                                        className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm bg-white" 
                                        value={data.prasyarat_id || ''} 
                                        onChange={e => setData('prasyarat_id', e.target.value === '' ? null : Number(e.target.value))}
                                    >
                                        <option value="">- Tidak Ada -</option>
                                        {mataKuliahs.map((mkOption) => (
                                            mkOption.id !== selectedId && (
                                                <option key={mkOption.id} value={mkOption.id}>
                                                    {mkOption.nama_mk}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                    {errors.prasyarat_id && <p className="text-red-500 text-xs mt-1">{errors.prasyarat_id}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                                <textarea rows={3} className="w-full border-gray-300 rounded-lg focus:ring-polman-primary text-sm" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Data'}</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}
