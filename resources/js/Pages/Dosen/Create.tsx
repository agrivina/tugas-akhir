import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface DosenBiodata {
    id: number;
    nama_lengkap: string;
    gelar_depan: string | null;
    gelar_belakang: string | null;
    nip: string;
    email: string;
}

export default function CreateDosen({ biodatas }: { biodatas: DosenBiodata[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        dosen_biodata_id: '',
        email: '',
        password: '',
    });

    const selectedBiodata = biodatas.find((biodata) => biodata.id.toString() === data.dosen_biodata_id);

    const formatName = (biodata: DosenBiodata) => {
        return [biodata.gelar_depan, biodata.nama_lengkap, biodata.gelar_belakang].filter(Boolean).join(' ');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dosen.store'), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrasi Akun Dosen</h2>}
        >
            <Head title="Register Dosen" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 border border-gray-200">
                        {biodatas.length === 0 && (
                            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
                                Belum ada biodata dosen yang tersedia untuk dibuatkan akun. Tambahkan biodata dosen terlebih dahulu.
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="dosen_biodata_id" value="Pilih Biodata Dosen" />
                                <select
                                    id="dosen_biodata_id"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.dosen_biodata_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const biodata = biodatas.find((item) => item.id.toString() === value);

                                        setData({
                                            ...data,
                                            dosen_biodata_id: value,
                                            email: biodata?.email || '',
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Pilih dosen dari biodata</option>
                                    {biodatas.map((biodata) => (
                                        <option key={biodata.id} value={biodata.id}>
                                            {formatName(biodata)} - {biodata.nip}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.dosen_biodata_id} />
                            </div>

                            {selectedBiodata && (
                                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
                                    <div><span className="font-bold">Nama:</span> {formatName(selectedBiodata)}</div>
                                    <div><span className="font-bold">NIP:</span> {selectedBiodata.nip}</div>
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="email" value="Email Login Dosen" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password Awal" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.password} />
                                <p className="text-xs text-red-500 mt-1">*Kaprodi menginput password awal. Dosen diwajibkan mengubahnya nanti.</p>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4 bg-teal-600 hover:bg-teal-700" disabled={processing || biodatas.length === 0}>
                                    Simpan & Daftarkan Dosen
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
