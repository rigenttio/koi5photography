<?php

namespace App\Http\Controllers\api;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = validator($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ], [
            'required' => 'Tidak boleh kosong'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $admin = Admin::where('email', $request->email)->first();

        if ($admin) {
            return $this->checkUser($admin, $data, $request->ip());
        } else {
            return response()->json([
                'status' => false,
                'errorType' => 'userNotFound',
                'message' => 'Akun tidak ditemukan'
            ], 400);
        }
    }

    function checkUser($admin, $data, $ip)
    {
        if (RateLimiter::tooManyAttempts('login:' . $admin->email . $ip, 5)) {
            return response()->json([
                'status' => false,
                'errorType' => 'rateLimitExceeded',
                'message' => "Anda telah mencapai batas percobaan login",
                'availableIn' => RateLimiter::availableIn('login:' . $admin->email . $ip)
            ], 429);
        }

        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            RateLimiter::hit('login:' . $admin->email . $ip, 1800);
            return response()->json([
                'status' => false,
                'errorType' => 'invalidPassword',
                'message' => 'Credentials yang Anda masukkan tidak valid',
                'attemptsLeft' => RateLimiter::remaining('login:' . $admin->email . $ip, 5)
            ], 400);
        }

        $token = $admin->createToken($admin->email)->plainTextToken;
        RateLimiter::clear('login:' . $admin->email . $ip);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil login',
            'token' => $token
        ], 200);
    }

    public function me()
    {
        $admin = Admin::findOrFail(auth()->id());

        return response()->json([
            'status' => true,
            'data' => $admin
        ], 200);
    }
}
