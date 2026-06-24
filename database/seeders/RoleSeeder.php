<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Ciptakan Role
        Role::create(['name' => 'Kaprodi']);
        Role::create(['name' => 'Dosen']);

        // Ciptakan Akun Kaprodi (Super Admin)
        $kaprodi = User::create([
            'name' => 'Polisi TRIN',
            'email' => 'kaprodi@polman.edu',
            'nip' => '198001012005011001', // NIP Dummy
            'password' => Hash::make('123456789'),
        ]);

        // Sematkan Role Kaprodi ke akun tersebut
        $kaprodi->assignRole('Kaprodi');
    }
}