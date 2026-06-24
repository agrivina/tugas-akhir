<?php

namespace App\Http\Controllers;

use App\Models\DosenBiodata;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        $dosenBiodata = $user->dosen_biodata;

        return inertia('Profile/Edit', [
            'dosenBiodata' => $dosenBiodata,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'nip' => ['nullable', 'string', 'max:50'],
            
            // DosenBiodata fields
            'gelar_depan' => ['nullable', 'string', 'max:50'],
            'gelar_belakang' => ['nullable', 'string', 'max:50'],
            'nidn' => ['nullable', 'string', 'max:50'],
            'no_hp' => ['nullable', 'string', 'max:30'],
            'jabatan_akademik' => ['nullable', 'string', 'max:100'],
            'bidang_keahlian' => ['nullable', 'string'],
            'alamat' => ['nullable', 'string'],
        ]);

        // Update user data (hanya name, email, nip)
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->nip = $validated['nip'];
        $user->save();

        // Update DosenBiodata if exists
        if ($user->dosen_biodata_id) {
            $dosenBiodata = DosenBiodata::find($user->dosen_biodata_id);
            if ($dosenBiodata) {
                $dosenBiodata->update([
                    'nama_lengkap' => $validated['name'],
                    'gelar_depan' => $validated['gelar_depan'],
                    'gelar_belakang' => $validated['gelar_belakang'],
                    'email' => $validated['email'],
                    'nip' => $validated['nip'],
                    'nidn' => $validated['nidn'],
                    'no_hp' => $validated['no_hp'],
                    'jabatan_akademik' => $validated['jabatan_akademik'],
                    'bidang_keahlian' => $validated['bidang_keahlian'],
                    'alamat' => $validated['alamat'],
                ]);
            }
        }

        return back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
