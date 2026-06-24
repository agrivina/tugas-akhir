import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Biodata {
    id: number;
    nama_lengkap: string;
    gelar_depan: string | null;
    gelar_belakang: string | null;
    nip: string | null;
    nidn: string | null;
    email: string;
    no_hp: string | null;
    prodi: string;
    jabatan_akademik: string;
    bidang_keahlian: string | null;
    alamat: string | null;
}

interface Props {
    biodata: Biodata | null;
    isComplete: boolean;
}

const prodiOptions = [
    'Teknologi Rekayasa Informatika Industri',
    'Teknologi Rekayasa Otomasi',
    'Teknologi Rekayasa Mekatronika',
    'Teknologi Rekayasa Sistem Aerial Nirawak',
];

export default function ProfileSaya({ biodata, isComplete }: Props) {
    const { auth } = usePage().props as any;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        nama_lengkap:     biodata?.nama_lengkap     ?? '',
        gelar_depan:      biodata?.gelar_depan      ?? '',
        gelar_belakang:   biodata?.gelar_belakang   ?? '',
        nip:              biodata?.nip              ?? '',
        nidn:             biodata?.nidn             ?? '',
        email:            biodata?.email            ?? auth.user.email ?? '',
        no_hp:            biodata?.no_hp            ?? '',
        prodi:            biodata?.prodi            ?? prodiOptions[0],
        jabatan_akademik: biodata?.jabatan_akademik ?? '',
        bidang_keahlian:  biodata?.bidang_keahlian  ?? '',
        alamat:           biodata?.alamat           ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('biodata-saya.update'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profil Saya" />

            <div className="mb-6">
                <h2 className="font-headline font-bold text-2xl text-gray-900">Profil Saya</h2>
                <p className="text-gray-500 text-sm mt-1 font-body">
                    Lengkapi data diri Anda. Informasi ini akan digunakan pada RPS dan sistem penilaian.
                </p>
            </div>

            {/* Banner peringatan jika biodata belum diisi */}
            {!isComplete && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <div>
                        <p className="font-bold text-yellow-800 text-sm">Biodata belum dilengkapi</p>
                        <p className="text-yellow-700 text-xs mt-0.5">Lengkapi profil Anda agar dapat ditugaskan pada Mata Kuliah dan RPS.</p>
                    </div>
                </div>
            )}

            {/* Success message */}
            {recentlySuccessful && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-bold text-sm">Profil berhasil disimpan!</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-5 font-body">

                    {/* Nama & Gelar */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Identitas</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Gelar Depan" placeholder="Dr., Ir., dll." value={data.gelar_depan} onChange={(v) => setData('gelar_depan', v)} error={errors.gelar_depan} />
                            <Field label="Nama Lengkap" required placeholder="Nama tanpa gelar" value={data.nama_lengkap} onChange={(v) => setData('nama_lengkap', v)} error={errors.nama_lengkap} />
                            <Field label="Gelar Belakang" placeholder="M.T., S.T., Ph.D., dll." value={data.gelar_belakang} onChange={(v) => setData('gelar_belakang', v)} error={errors.gelar_belakang} />
                        </div>
                    </div>

                    {/* NIP, NIDN, Email */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Data Kepegawaian</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="NIP" placeholder="198001012010011001" value={data.nip} onChange={(v) => setData('nip', v)} error={errors.nip} />
                            <Field label="NIDN" placeholder="0101800001" value={data.nidn} onChange={(v) => setData('nidn', v)} error={errors.nidn} />
                            <Field label="Email Institusi" type="email" required value={data.email} onChange={(v) => setData('email', v)} error={errors.email} />
                        </div>
                    </div>

                    {/* Prodi & Jabatan */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Akademik</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="No. HP" placeholder="08xx-xxxx-xxxx" value={data.no_hp} onChange={(v) => setData('no_hp', v)} error={errors.no_hp} />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Program Studi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-polman-primary focus:ring-polman-primary"
                                    value={data.prodi}
                                    onChange={(e) => setData('prodi', e.target.value)}
                                    required
                                >
                                    {prodiOptions.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                {errors.prodi && <p className="text-red-500 text-xs mt-1">{errors.prodi}</p>}
                            </div>
                            <Field label="Jabatan Akademik" required placeholder="Lektor, Asisten Ahli, dll." value={data.jabatan_akademik} onChange={(v) => setData('jabatan_akademik', v)} error={errors.jabatan_akademik} />
                        </div>
                    </div>

                    {/* Bidang keahlian & alamat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextArea label="Bidang Keahlian" placeholder="Machine Learning, Embedded Systems, dll." value={data.bidang_keahlian} onChange={(v) => setData('bidang_keahlian', v)} />
                        <TextArea label="Alamat" placeholder="Alamat lengkap" value={data.alamat} onChange={(v) => setData('alamat', v)} />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-polman-primary hover:bg-polman-secondary disabled:opacity-60 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({
    label, value, onChange, type = 'text', required = false, error, placeholder = '',
}: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; required?: boolean; error?: string; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                className="w-full rounded-lg border-gray-300 text-sm focus:border-polman-primary focus:ring-polman-primary"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <textarea
                rows={2}
                className="w-full rounded-lg border-gray-300 text-sm focus:border-polman-primary focus:ring-polman-primary"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
