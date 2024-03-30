<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\EmailVerification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = validator($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'address' => 'required',
            'no_tlp' => 'required',
            'email' => 'required|unique:users,email',
            'password' => 'required',
            'password_confirmation' => 'required|same:password'
        ], [
            'required' => 'Tidak boleh kosong',
            'same' => 'Password tidak cocok',
            'email.unique' => 'Email sudah digunakan'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $token = Str::random(128);
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'no_tlp' => $request->no_tlp,
            'address' => $request->address,
            'password' => Hash::make($request->password),
            'token_verify' => hash('sha256', $token)
        ]);

        try {
            Mail::to($user->email)->queue(new EmailVerification($user->first_name, $token, $user->email));
            return response()->json([
                'status' => true,
                'message' => 'Register berhasil silahkan cek email'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something wrong!'
            ], 400);
        }
    }

    public function verifyEmail(Request $request)
    {
        $validator = validator($request->all(), [
            'email' => 'required',
            'token' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Bad request'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => false,
                'errorType' => 'userNotFound',
                'message' => 'No query result'
            ], 404);
        }
        if ($user->token_verify === hash('sha256', $request->token)) {
            $user->markEmailAsVerified();
            $user->update([
                'token_verify' => null
            ]);
            $user->save();
            return response()->json([
                'status' => true,
                'message' => 'Berhasil verifikasi email'
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Gagal verification email'
            ], 400);
        }
    }
}
