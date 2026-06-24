import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Definisi interface TypeScript untuk mapping struktur data
interface Dosen {
    id: number;
    name: string;
    email: string;
    nip: string;
    created_at: string;
    dosen_biodata?: {
        nama_lengkap: string;
        gelar_depan: string | null;
        gelar_belakang: string | null;
        nip: string;
        nidn: string;
        prodi: string;
        jabatan_akademik: string;
    } | null;
}

export default function IndexDosen({ dosens }: { dosens: Dosen[] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Akun Dosen</h2>}
        >
            <Head title="Daftar Dosen" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-200">
                        
                        {/* Header Tabel & Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Daftar Akun Dosen Terdaftar</h3>
                            <Link
                                href={route('dosen.create')}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors"
                            >
                                + Register Dosen Baru
                            </Link>
                        </div>

                        {/* Tabel Data */}
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Register</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dosens && dosens.length > 0 ? (
                                        dosens.map((dosen) => (
                                            <tr key={dosen.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{dosen.nip || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dosen.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dosen.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {dosen.dosen_biodata?.jabatan_akademik || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(dosen.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                                Belum ada data dosen yang didaftarkan ke dalam sistem.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
