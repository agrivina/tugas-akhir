<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Set session domain dinamis berdasarkan host yang aktif
        $host = request()->getHost();
        if ($host !== 'localhost' && $host !== '127.0.0.1') {
            Config::set('session.domain', $host);
        }
    }
}