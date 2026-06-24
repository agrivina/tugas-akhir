# Setup Guide - Sistem Kurikulum Multi-Tenant

Dokumentasi lengkap untuk setup project dari awal hingga seeder.

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- MySQL/MariaDB
- Node.js & NPM
- Git

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd pbl-kurikulum/kurikulum-laravel
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kurikulum_landlord
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Create Database

Buat database central (landlord):

```sql
CREATE DATABASE kurikulum_landlord CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Atau menggunakan PHP:

```bash
php -r "
\$pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
\$pdo->exec('CREATE DATABASE IF NOT EXISTS kurikulum_landlord CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
echo 'Database created successfully!';
"
```

### 6. Run Migrations

#### Central Migrations

Jalankan migrasi untuk database central (landlord):

```bash
php artisan migrate
```

Ini akan membuat tabel:
- `tenants` - Daftar tenant
- `domains` - Domain untuk setiap tenant
- `prodis` - Data program studi
- `sessions` - Session management
- `migrations` - Migration tracking

#### Seed Tenants

Jalankan seeder untuk membuat tenant:

```bash
php artisan db:seed --class=TenantSeeder
```

Ini akan membuat 4 tenant:
- **trin** - Teknik Rekayasa Informatika Industri (trin.localhost)
- **tro** - Teknik Rekayasa Otomasi (tro.localhost)
- **trmo** - Teknik Rekayasa Manufaktur Otomasi (trmo.localhost)
- **trsa** - Teknik Rekayasa Sistem Agrikultur (trsa.localhost)

Setiap tenant akan otomatis:
1. Membuat database baru (contoh: `kurikulum_trin`)
2. Menjalankan migrasi tenant
3. Membuat domain entry

#### Tenant Migrations

Migrasi tenant akan otomatis dijalankan saat tenant dibuat. Namun jika perlu manual:

```bash
php artisan tenants:migrate
```

Ini akan membuat tabel di setiap database tenant:
- `cpls` - Capaian Pembelajaran Lulusan
- `ieas` - IEA (International Engineering Alliance)
- `ppms` - Profil Pekerjaan Mandiri
- `cpl_iea`, `cpl_ppm`, `ppm_iea` - Tabel relasi
- `indikator_kinerjas` - Indikator kinerja
- `mata_kuliahs` - Mata kuliah
- `mk_cpl` - Relasi mata kuliah dan CPL
- `cpmks` - Capaian Pembelajaran Mata Kuliah
- `cpmk_indikator_kinerja`, `ik_cpmk` - Tabel relasi CPMK
- `dosen_biodatas` - Biodata dosen
- `dosen_biodata_mata_kuliah` - Relasi dosen dan mata kuliah
- `roles`, `permissions` - Spatie permission tables
- `model_has_permissions`, `model_has_roles`, `role_has_permissions`
- `users` - User accounts
- `rps` - Rencana Pembelajaran Semester
- `rps_details` - Detail RPS per pertemuan
- `rps_penilaians` - Penilaian RPS

### 7. Seed Additional Data (Optional)

Jika ada seeder tambahan:

```bash
# Seed roles and permissions
php artisan db:seed --class=RoleSeeder

# Seed sample data for specific tenant
php artisan db:seed --class=KurikulumTrinSeeder
```

### 8. Build Assets

```bash
npm run build

# Atau untuk development
npm run dev
```

### 9. Run Application

```bash
php artisan serve
```

Aplikasi akan berjalan di `http://localhost:8000`

## 🏗️ Struktur Database

### Central Database (`kurikulum_landlord`)

```
kurikulum_landlord/
├── tenants              # Daftar tenant
├── domains              # Domain mapping
├── prodis               # Program studi
└── sessions             # Session data
```

### Tenant Databases (`kurikulum_*`)

Setiap tenant memiliki database terpisah dengan prefix `kurikulum_`:

```
kurikulum_trin/
├── cpls                 # Capaian Pembelajaran
├── ieas                 # IEA Standards
├── ppms                 # Profil Pekerjaan
├── mata_kuliahs         # Mata Kuliah
├── dosen_biodatas       # Dosen
├── users                # Users
├── rps                  # RPS
└── ... (23 tables total)
```

## 🔧 Configuration

### Tenancy Configuration

File: `config/tenancy.php`

```php
'database' => [
    'prefix' => env('TENANCY_DATABASE_PREFIX', 'kurikulum_'),
    'suffix' => '',
],
```

Untuk testing, bisa override prefix di `.env.testing`:

```env
TENANCY_DATABASE_PREFIX=kurikulum_test_
```

### Migration Paths

- **Central migrations**: `database/migrations/`
- **Tenant migrations**: `database/migrations/tenant/`

## 🧪 Testing

### Setup Test Environment

```bash
# Copy .env untuk testing
cp .env .env.testing

# Edit .env.testing
DB_DATABASE=kurikulum_test_landlord
TENANCY_DATABASE_PREFIX=kurikulum_test_
```

### Run Test Migrations

```bash
# Create test database
php -r "
\$pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
\$pdo->exec('CREATE DATABASE IF NOT EXISTS kurikulum_test_landlord');
"

# Run migrations
php artisan migrate --env=testing
php artisan db:seed --class=TenantSeeder --env=testing
php artisan tenants:migrate --env=testing
```

### Cleanup Test Databases

```bash
php -r "
\$pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
\$pdo->exec('DROP DATABASE IF EXISTS kurikulum_test_landlord');
\$pdo->exec('DROP DATABASE IF EXISTS kurikulum_test_trin');
\$pdo->exec('DROP DATABASE IF EXISTS kurikulum_test_tro');
\$pdo->exec('DROP DATABASE IF EXISTS kurikulum_test_trmo');
\$pdo->exec('DROP DATABASE IF EXISTS kurikulum_test_trsa');
echo 'Test databases cleaned!';
"
```

## 🔄 Reset Database

Jika perlu reset database dari awal:

```bash
# Drop all tables dan re-migrate
php artisan migrate:fresh

# Dengan seeder
php artisan migrate:fresh --seed

# Untuk tenant
php artisan tenants:migrate-fresh
```

## 📝 Troubleshooting

### Error: Database does not exist

Pastikan database sudah dibuat sebelum menjalankan migrasi.

### Error: Foreign key constraint

Pastikan urutan migrasi benar. Tabel parent harus dibuat sebelum tabel child.

### Error: Table already exists

Jika tabel sudah ada, gunakan:

```bash
php artisan migrate:fresh
```

### Tenant database tidak terbuat

Cek event listener di `app/Providers/TenancyServiceProvider.php`:

```php
Events\TenantCreated::class => [
    JobPipeline::make([
        Jobs\CreateDatabase::class,
        Jobs\MigrateDatabase::class,
    ])
]
```

## 🎯 Next Steps

Setelah setup selesai:

1. Buat user admin untuk setiap tenant
2. Setup roles dan permissions
3. Import data master (CPL, IEA, PPM)
4. Konfigurasi domain untuk production

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Tenancy for Laravel](https://tenancyforlaravel.com/docs)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)

## 🤝 Contributing

Jika menemukan bug atau ingin berkontribusi, silakan buat issue atau pull request.

## 📄 License

MIT License
