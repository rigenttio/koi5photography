<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ResetPassword;
use Illuminate\Support\Carbon;
use App\Mail\EmailResetPassword;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $validator = validator($request->all(), [
            'email' => 'required',
        ], [
            'required' => 'Tidak boleh kosong',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = Str::random(128);
        ResetPassword::create([
            'email' => $user->email,
            'token' => hash('sha256', $token),
            'token_exp' => Carbon::now()->addMinutes(10),
        ]);

        try {
            Mail::to($user->email)->queue(new EmailResetPassword($user->first_name, $token, $user->email));
            return response()->json([
                'status' => true,
                'message' => 'Forgot password berhasil silahkan cek email'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something wrong!'
            ], 400);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = validator($request->all(), [
            'email' => 'required',
            'token' => 'required',
            'password' => 'required',
            'password_confirmation' => 'required|same:password'
        ], [
            'required' => 'Tidak boleh kosong',
            'same' => 'Password tidak cocok',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $resetPassword = ResetPassword::where('token', hash('sha256', $request->token))
            ->where('email', $request->email)->firstOrFail();

        $tokenExp = Carbon::parse($resetPassword->token_exp);
        if ($tokenExp >= Carbon::now() && !$resetPassword->used_at) {
            $user->update(['password' => Hash::make($request->password)]);
            $user->save();
            $resetPassword->update(['used_at' => now()]);
            $resetPassword->save();
            return response()->json([
                'status' => true,
                'message' => 'Berhasil reset password'
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'errorType' => 'Failed',
                'message' => 'Something Wrong!'
            ], 400);
        }
    }

    public function changePassword(Request $request)
    {
        $validator = validator($request->all(), [
            'old_password' => 'required',
            'password' => 'required',
        ], [
            'required' => 'Tidak boleh kosong',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail(auth()->id());
        if (Hash::check($request->old_password, $user->password)) {
            $user->update(["password" => Hash::make($request->password)]);
            return response()->json([
                'status' => true,
                'message' => "berhasil update password"
            ], 200);
        } else {
            return response()->json([
                'status' => true,
                'errorType' => "oldPassword",
                'message' => "Password lama salah"
            ], 400);
        }
    }
}
