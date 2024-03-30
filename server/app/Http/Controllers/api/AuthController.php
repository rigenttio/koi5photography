<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
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
        $user = User::where('email', $request->email)->first();

        if ($user) {
            return $this->checkUser($user, $data, $request->ip());
        } else {
            return response()->json([
                'status' => false,
                'errorType' => 'userNotFound',
                'message' => 'Akun tidak ditemukan'
            ], 400);
        }
    }

    function checkUser($user, $data, $ip)
    {
        if (RateLimiter::tooManyAttempts('login:' . $user->email . $ip, 5)) {
            return response()->json([
                'status' => false,
                'errorType' => 'rateLimitExceeded',
                'message' => "Anda telah mencapai batas percobaan login",
                'availableIn' => RateLimiter::availableIn('login:' . $user->email . $ip)
            ], 429);
        }

        if (!$user || !Hash::check($data['password'], $user->password)) {
            RateLimiter::hit('login:' . $user->email . $ip, 1800);
            return response()->json([
                'status' => false,
                'errorType' => 'invalidPassword',
                'message' => 'Credentials yang Anda masukkan tidak valid',
                'attemptsLeft' => RateLimiter::remaining('login:' . $user->email . $ip, 5)
            ], 400);
        } elseif (!$user->email_verified_at) {
            return response()->json([
                'status' => false,
                'errorType' => 'verification',
                'message' => 'Harap verifikasi email terlebih dahulu'
            ], 400);
        }

        $token = $user->createToken($user->first_name)->plainTextToken;
        RateLimiter::clear('login:' . $user->email . $ip);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil login',
            'token' => $token
        ], 200);
    }

    public function logout()
    {
        $user = User::findOrFail(auth()->id());

        if ($user) {
            $user->tokens()->delete();
        }

        return response()->json([
            'status' => true,
            'message' => 'Berhasil logout',
        ], 200);
    }

    public function me()
    {
        $user = User::findOrFail(auth()->id());

        return response()->json([
            'status' => true,
            'data' => $user
        ], 200);
    }
}
