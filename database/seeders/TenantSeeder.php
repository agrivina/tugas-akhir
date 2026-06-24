<?php

namespace Database\Seeders;

use App\Models\Prodi;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = [
            ['id' => 'trin', 'domain' => 'trin.localhost', 'kode' => 'TRIN', 'nama' => 'Teknik Rekayasa Informatika Industri'],
            ['id' => 'tro', 'domain' => 'tro.localhost', 'kode' => 'TRO', 'nama' => 'Teknik Rekayasa Otomasi'],
            ['id' => 'trmo', 'domain' => 'trmo.localhost', 'kode' => 'TRMO', 'nama' => 'Teknik Rekayasa Manufaktur Otomasi'],
            ['id' => 'trsa', 'domain' => 'trsa.localhost', 'kode' => 'TRSA', 'nama' => 'Teknik Rekayasa Sistem Agrikultur'],
        ];

        foreach ($tenants as $item) {
            // Gunakan create() bukan firstOrCreate() supaya event TenantCreated
            // terpicu → database tenant otomatis dibuat & di-migrate
            $existing = Tenant::find($item['id']);

            if ($existing) {
                $tenant = $existing;
            } else {
                $tenant = Tenant::create(['id' => $item['id']]);
            }

            $tenant->domains()->firstOrCreate(['domain' => $item['domain']]);

            Prodi::updateOrCreate(
                ['kode' => $item['kode']],
                ['nama' => $item['nama'], 'tenant_id' => $tenant->id]
            );
        }
    }
}