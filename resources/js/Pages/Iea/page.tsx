import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dialog } from '@headlessui/react';

interface Iea {
    id: number;
    kode: string;
    deskripsi: string;
}

interface Props {
    ieas: Iea[];
}

export default function IeaPage({ ieas }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, patch, reset, processing, errors, clearErrors } = useForm({
        deskripsi: '',
    });

    const openAddModal = () => {
        setModalMode('add');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (iea: Iea) => {
        setModalMode('edit');
        setSelectedId(iea.id);
        setData('deskripsi', iea.deskripsi);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post('/iea', { onSuccess: () => closeModal() });
        } else {
            patch(`/iea/${selectedId}`, { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: number, kode: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${kode}?`)) {
            router.delete(`/iea/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Data IEA" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline font-bold text-2xl text-gray-900">Indikator Elemen Able (IEA)</h2>
                    <p className="text-gray-500 text-sm font-body mt-1">Kelola data indikator penilaian mahasiswa.</p>
                </div>
                <button onClick={openAddModal} className="bg-polman-primary hover:bg-polman-secondary text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors shadow-sm">
                    + Tambah IEA
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-body">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-polman-neutral">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-32">Kode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Deskripsi</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {!ieas || ieas.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada data IEA.</td></tr>
                        ) : (
                            ieas.map((iea) => (
                                <tr key={iea.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-bold text-polman-primary">{iea.kode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{iea.deskripsi}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(iea)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(iea.id, iea.kode)} className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl font-body">
                        <Dialog.Title className="font-headline text-xl font-bold text-gray-900 mb-4">
                            {modalMode === 'add' ? 'Tambah Data IEA' : 'Edit Data IEA'}
                        </Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi IEA</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-polman-primary focus:border-polman-primary"
                                    rows={4} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} required
                                />
                                {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-bold text-white bg-polman-primary hover:bg-polman-secondary rounded-lg">
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    );
}