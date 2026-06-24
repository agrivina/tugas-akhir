import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full bg-white font-body">

            {/* AREA KIRI: Branding & Visual (Hanya muncul di layar besar) */}
            <div className="relative hidden w-1/2 flex-col justify-center px-16 lg:flex bg-polman-primary overflow-hidden">

                {/* 1. Background Image dengan Opacity */}
                {/* mix-blend-luminosity membantu menyatukan warna gambar dengan warna hijau background */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
                    style={{ backgroundImage: "url('/images/ae-bg.jpg')" }}
                />

                {/* 2. Konten Teks & Logo (z-10 agar berada di atas gambar) */}
                <div className="relative z-10">

                    {/* Header: Logo & Brand Name */}
                    <div className="mb-16 flex items-center gap-6">
                        {/* Render Logo dengan Wadah Putih (Solusi 1) */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-xl transition-transform hover:scale-105">
                            <img
                                src="/images/polman.png"
                                alt="Automation Engineering Logo"
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    document.getElementById('fallback-logo')!.style.display = 'flex';
                                }}
                            />
                        </div>

                        {/* Fallback Inisial AE jika gambar gagal dimuat */}
                        <div id="fallback-logo" className="hidden h-20 w-20 bg-gray-900 rounded-2xl items-center justify-center text-white font-bold text-2xl shadow-xl">
                            AE
                        </div>

                        {/* Teks Brand */}
                        <div className="flex flex-col">
                            <span className="font-headline text-2xl font-bold text-white tracking-wide leading-tight">
                                Automation <br /> Engineering
                            </span>
                            <span className="text-[10px] text-polman-tertiary uppercase tracking-[0.2em] font-bold mt-1">
                                Official Portal
                            </span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <h1 className="font-headline text-5xl font-bold leading-tight text-white mb-6">
                        Engineering The <br /> Future of <br /> Curriculum.
                    </h1>
                    <p className="text-lg text-polman-tertiary max-w-md leading-relaxed">
                        Integrated OBE management system for Industrial Engineering Technology.
                    </p>
                </div>
            </div>

            {/* AREA KANAN: Form Login/Register */}
            <div className="flex w-full items-center justify-center lg:w-1/2 px-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

        </div>
    );
}