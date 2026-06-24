import Modal from '@/Components/Modal';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconPencil = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const IconLock = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const IconArrowLeft = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const IconX = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ─── Komponen Pendukung ──────────────────────────────────────────────────────

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
    return (
        <div className="flex flex-col gap-1.5">
            {/* Label menggunakan font-manrope */}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-manrope">{label}</span>
            {badge ? (
                // Badge menggunakan Tertiary color (#7FFFD4)
                <span className="inline-flex self-start items-center px-3 py-1 rounded-md text-sm font-bold text-[#2F4F4F] bg-[#7FFFD4]/30 border border-[#7FFFD4]/50 font-manrope">
                    {value}
                </span>
            ) : (
                <span className="text-base font-medium text-[#2F4F4F]">{value}</span>
            )}
        </div>
    );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
    return (
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
            <div>
                <h3 className="text-lg font-bold text-[#2F4F4F] font-space-grotesk">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 font-inter">{subtitle}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <IconX />
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    
    // Asumsi user object dari Breeze
    const { user, roles } = usePage().props.auth as any;
    const primaryRole: string = roles?.[0] ?? 'User';

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        // Background utama slate-50
        <div className="min-h-screen bg-slate-50 font-inter">
            <Head title="Profile" />

            {/* ── Minimal Top Bar ─────────────────────────────────────────── */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
                <Link
                    href={route('dashboard')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#008B8B] transition-colors"
                >
                    <IconArrowLeft />
                    Kembali ke Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#008B8B] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="font-bold text-[#2F4F4F] text-sm leading-tight font-manrope">POLMAN Bandung</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-manrope">TRIN Engineering</p>
                    </div>
                </div>
            </header>

            {/* ── Page Content ─────────────────────────────────────────────── */}
            {/* Karena card statistik dihapus, profile card dibuat di tengah dengan max-w-3xl agar proporsional */}
            <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

                {/* Page Title */}
                <div>
                    <h1 className="text-3xl font-bold text-[#2F4F4F] tracking-tight font-space-grotesk">Profile Saya</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola informasi akun, jabatan, dan keamanan Anda.</p>
                </div>

                {/* ── Profile Card ────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* Banner - Primary Color (#008B8B) */}
                    <div className="h-32 bg-[#008B8B] relative overflow-hidden">
                        {/* Aksen motif pada banner */}
                        <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '24px 24px'
                            }}
                        />
                    </div>

                    <div className="px-8 pb-8 relative">
                        {/* Avatar — Menimpa banner dengan margin negatif */}
                        <div className="-mt-12 mb-8 flex justify-between items-end">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'User')}&background=2F4F4F&color=fff&size=128`}
                                alt="Avatar"
                                className="w-24 h-24 rounded-xl border-4 border-white shadow-sm object-cover bg-white"
                            />
                            
                            {/* Action Buttons Pindah ke Atas/Kanan (Layout lebih bersih) */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#2F4F4F] text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 transition-colors"
                                >
                                    <IconLock />
                                    Ubah Password
                                </button>
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#008B8B] text-white text-sm font-semibold rounded-lg hover:bg-[#007070] shadow-sm focus:ring-2 focus:ring-[#008B8B] focus:ring-offset-2 transition-colors"
                                >
                                    <IconPencil />
                                    Edit Profil
                                </button>
                            </div>
                        </div>

                        {/* Identity Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 border-t border-slate-100 pt-8">
                            <InfoRow label="Nama Lengkap" value={user?.name ?? '—'} />
                            <InfoRow label="Email Institusi" value={user?.email ?? '—'} />
                            <InfoRow label="NIP / NIDN" value={user?.nip ?? 'Belum terdaftar'} />
                            <InfoRow label="Peran / Jabatan" value={primaryRole} badge />
                        </div>
                        
                    </div>
                </div>
            </main>

            {/* ── Modal: Edit Profil ───────────────────────────────────────── */}
            <Modal show={showProfileModal} maxWidth="lg" onClose={() => setShowProfileModal(false)}>
                <ModalHeader
                    title="Edit Profil"
                    subtitle="Perbarui informasi identitas Anda"
                    onClose={() => setShowProfileModal(false)}
                />
                <div className="px-6 py-5">
                    <UpdateProfileInformationForm onSuccess={() => setShowProfileModal(false)} />
                </div>
            </Modal>

            {/* ── Modal: Ubah Password ─────────────────────────────────────── */}
            <Modal show={showPasswordModal} maxWidth="lg" onClose={() => setShowPasswordModal(false)}>
                <ModalHeader
                    title="Ubah Password"
                    subtitle="Pastikan akun Anda tetap aman dengan password yang kuat"
                    onClose={() => setShowPasswordModal(false)}
                />
                <div className="px-6 py-5">
                    <UpdatePasswordForm onSuccess={() => setShowPasswordModal(false)} />
                </div>
            </Modal>

        </div>
    );
}