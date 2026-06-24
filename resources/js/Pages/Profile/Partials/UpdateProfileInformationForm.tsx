import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    className = '',
    onSuccess,
}: {
    className?: string;
    onSuccess?: () => void;
}) {
    // 1. Tarik user, roles, dan dosenBiodata dari shared props
    const page = usePage();
    const { user, roles } = page.props.auth as any;
    const { dosenBiodata } = page.props as any;
    const roleName = roles?.length > 0 ? roles[0] : 'Dosen';

    // 2. Payload dengan semua field yang bisa diedit
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        nip: user.nip || '',
        gelar_depan: dosenBiodata?.gelar_depan || '',
        gelar_belakang: dosenBiodata?.gelar_belakang || '',
        nidn: dosenBiodata?.nidn || '',
        no_hp: dosenBiodata?.no_hp || '',
        jabatan_akademik: dosenBiodata?.jabatan_akademik || '',
        bidang_keahlian: dosenBiodata?.bidang_keahlian || '',
        alamat: dosenBiodata?.alamat || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess,
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-teal-600 shadow-sm">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff&size=128`} alt="Profile" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-headline">
                            Informasi Profil
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 font-body">
                            Kelola identitas personal Anda di dalam sistem TRIN.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5 font-body">
                
                {/* Field Jabatan (Read-Only) */}
                <div>
                    <InputLabel htmlFor="role" value="Jabatan Sistem" className="text-xs uppercase tracking-wider text-gray-500" />
                    <TextInput
                        id="role"
                        type="text"
                        className="mt-1 block w-full bg-gray-50 border-gray-200 text-teal-700 cursor-not-allowed font-bold"
                        value={roleName}
                        disabled
                    />
                </div>

                {/* Nama Lengkap */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-xs uppercase tracking-wider text-gray-500" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Gelar Depan & Belakang */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="gelar_depan" value="Gelar Depan" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="gelar_depan"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.gelar_depan}
                            onChange={(e) => setData('gelar_depan', e.target.value)}
                            placeholder="Dr., Ir., dll"
                        />
                        <InputError className="mt-2" message={errors.gelar_depan} />
                    </div>

                    <div>
                        <InputLabel htmlFor="gelar_belakang" value="Gelar Belakang" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="gelar_belakang"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.gelar_belakang}
                            onChange={(e) => setData('gelar_belakang', e.target.value)}
                            placeholder="S.T., M.T., Ph.D., dll"
                        />
                        <InputError className="mt-2" message={errors.gelar_belakang} />
                    </div>
                </div>

                {/* Email & NIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email Institusi" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="nip" value="NIP (Nomor Induk Pegawai)" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="nip"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.nip} />
                    </div>
                </div>

                {/* NIDN & No HP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="nidn" value="NIDN (Nomor Induk Dosen Nasional)" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="nidn"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.nidn}
                            onChange={(e) => setData('nidn', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.nidn} />
                    </div>

                    <div>
                        <InputLabel htmlFor="no_hp" value="No. HP / WhatsApp" className="text-xs uppercase tracking-wider text-gray-500" />
                        <TextInput
                            id="no_hp"
                            type="text"
                            className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                            value={data.no_hp}
                            onChange={(e) => setData('no_hp', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                        />
                        <InputError className="mt-2" message={errors.no_hp} />
                    </div>
                </div>

                {/* Jabatan Akademik */}
                <div>
                    <InputLabel htmlFor="jabatan_akademik" value="Jabatan Akademik" className="text-xs uppercase tracking-wider text-gray-500" />
                    <TextInput
                        id="jabatan_akademik"
                        type="text"
                        className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                        value={data.jabatan_akademik}
                        onChange={(e) => setData('jabatan_akademik', e.target.value)}
                        placeholder="Lektor, Asisten Ahli, dll"
                    />
                    <InputError className="mt-2" message={errors.jabatan_akademik} />
                </div>

                {/* Bidang Keahlian */}
                <div>
                    <InputLabel htmlFor="bidang_keahlian" value="Bidang Keahlian" className="text-xs uppercase tracking-wider text-gray-500" />
                    <textarea
                        id="bidang_keahlian"
                        className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                        value={data.bidang_keahlian}
                        onChange={(e) => setData('bidang_keahlian', e.target.value)}
                        rows={3}
                        placeholder="Contoh: Rekayasa Perangkat Lunak, Machine Learning, IoT"
                    />
                    <InputError className="mt-2" message={errors.bidang_keahlian} />
                </div>

                {/* Alamat */}
                <div>
                    <InputLabel htmlFor="alamat" value="Alamat Lengkap" className="text-xs uppercase tracking-wider text-gray-500" />
                    <textarea
                        id="alamat"
                        className="mt-1 block w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm"
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        rows={3}
                        placeholder="Alamat lengkap tempat tinggal"
                    />
                    <InputError className="mt-2" message={errors.alamat} />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-teal-600 font-bold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
