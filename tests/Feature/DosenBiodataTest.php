<?php

namespace Tests\Feature;

use App\Models\DosenBiodata;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DosenBiodataTest extends TestCase
{
    use RefreshDatabase;

    private function kaprodi(): User
    {
        Role::findOrCreate('Kaprodi');

        $user = User::factory()->create();
        $user->assignRole('Kaprodi');

        return $user;
    }

    private function dosen(): User
    {
        Role::findOrCreate('Dosen');

        $user = User::factory()->create();
        $user->assignRole('Dosen');

        return $user;
    }

    public function test_kaprodi_can_create_dosen_biodata(): void
    {
        $this->actingAs($this->kaprodi())
            ->post(route('biodata-dosen.store'), [
                'nama_lengkap' => 'Budi Santoso',
                'gelar_depan' => 'Dr.',
                'gelar_belakang' => 'M.T.',
                'nip' => '198001012010121001',
                'nidn' => '0010018001',
                'email' => 'budi@polman.edu',
                'no_hp' => '081234567890',
                'prodi' => 'Teknologi Rekayasa Informatika Industri',
                'jabatan_akademik' => 'Lektor',
                'bidang_keahlian' => 'Software Engineering',
                'alamat' => 'Bandung',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('dosen_biodatas', [
            'nama_lengkap' => 'Budi Santoso',
            'nip' => '198001012010121001',
            'nidn' => '0010018001',
            'email' => 'budi@polman.edu',
        ]);
    }

    public function test_dosen_cannot_create_dosen_biodata(): void
    {
        $this->actingAs($this->dosen())
            ->post(route('biodata-dosen.store'), [
                'nama_lengkap' => 'Budi Santoso',
                'nip' => '198001012010121001',
                'nidn' => '0010018001',
                'email' => 'budi@polman.edu',
                'prodi' => 'Teknologi Rekayasa Informatika Industri',
                'jabatan_akademik' => 'Lektor',
            ])
            ->assertForbidden();
    }

    public function test_kaprodi_can_update_dosen_biodata(): void
    {
        $biodata = DosenBiodata::create([
            'nama_lengkap' => 'Budi Santoso',
            'nip' => '198001012010121001',
            'nidn' => '0010018001',
            'email' => 'budi@polman.edu',
            'prodi' => 'Teknologi Rekayasa Informatika Industri',
            'jabatan_akademik' => 'Asisten Ahli',
        ]);

        $this->actingAs($this->kaprodi())
            ->patch(route('biodata-dosen.update', $biodata), [
                'nama_lengkap' => 'Budi Santoso',
                'gelar_depan' => 'Dr.',
                'gelar_belakang' => 'M.T.',
                'nip' => '198001012010121001',
                'nidn' => '0010018001',
                'email' => 'budi@polman.edu',
                'no_hp' => '081234567890',
                'prodi' => 'Teknologi Rekayasa Informatika Industri',
                'jabatan_akademik' => 'Lektor',
                'bidang_keahlian' => 'Software Engineering',
                'alamat' => 'Bandung',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('dosen_biodatas', [
            'id' => $biodata->id,
            'jabatan_akademik' => 'Lektor',
        ]);
    }

    public function test_kaprodi_cannot_delete_biodata_that_is_used_by_user(): void
    {
        Role::findOrCreate('Dosen');

        $biodata = DosenBiodata::create([
            'nama_lengkap' => 'Budi Santoso',
            'nip' => '198001012010121001',
            'nidn' => '0010018001',
            'email' => 'budi@polman.edu',
            'prodi' => 'Teknologi Rekayasa Informatika Industri',
            'jabatan_akademik' => 'Lektor',
        ]);

        User::factory()->create([
            'dosen_biodata_id' => $biodata->id,
            'name' => 'Budi Santoso',
            'email' => 'budi.login@polman.edu',
            'nip' => '198001012010121001',
        ])->assignRole('Dosen');

        $this->actingAs($this->kaprodi())
            ->delete(route('biodata-dosen.destroy', $biodata))
            ->assertSessionHasErrors('biodata');

        $this->assertDatabaseHas('dosen_biodatas', [
            'id' => $biodata->id,
        ]);
    }

    public function test_kaprodi_can_create_dosen_account_from_biodata(): void
    {
        Role::findOrCreate('Dosen');

        $biodata = DosenBiodata::create([
            'nama_lengkap' => 'Budi Santoso',
            'gelar_depan' => 'Dr.',
            'gelar_belakang' => 'M.T.',
            'nip' => '198001012010121001',
            'nidn' => '0010018001',
            'email' => 'budi@polman.edu',
            'prodi' => 'Teknologi Rekayasa Informatika Industri',
            'jabatan_akademik' => 'Lektor',
        ]);

        $this->actingAs($this->kaprodi())
            ->post(route('dosen.store'), [
                'dosen_biodata_id' => $biodata->id,
                'email' => 'budi.login@polman.edu',
                'password' => 'password123',
            ])
            ->assertRedirect(route('dosen.index'));

        $this->assertDatabaseHas('users', [
            'dosen_biodata_id' => $biodata->id,
            'name' => 'Dr. Budi Santoso M.T.',
            'email' => 'budi.login@polman.edu',
            'nip' => '198001012010121001',
        ]);
    }

    public function test_kaprodi_cannot_create_duplicate_account_for_same_biodata(): void
    {
        Role::findOrCreate('Dosen');

        $biodata = DosenBiodata::create([
            'nama_lengkap' => 'Budi Santoso',
            'nip' => '198001012010121001',
            'nidn' => '0010018001',
            'email' => 'budi@polman.edu',
            'prodi' => 'Teknologi Rekayasa Informatika Industri',
            'jabatan_akademik' => 'Lektor',
        ]);

        User::factory()->create([
            'dosen_biodata_id' => $biodata->id,
            'email' => 'existing@polman.edu',
            'nip' => '198001012010121001',
        ])->assignRole('Dosen');

        $this->actingAs($this->kaprodi())
            ->post(route('dosen.store'), [
                'dosen_biodata_id' => $biodata->id,
                'email' => 'new@polman.edu',
                'password' => 'password123',
            ])
            ->assertSessionHasErrors('dosen_biodata_id');
    }
}
