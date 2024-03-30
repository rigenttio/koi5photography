<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $validator = validator($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'address' => 'required',
            'no_tlp' => 'required',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
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
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'address' => $request->address,
            'no_tlp' => $request->no_tlp,
        ]);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            $existsFile = Storage::disk('public')->exists('avatars/' . $user->avatar);
            if ($existsFile) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }

            $fileName = $user->id . uniqid() . '.' . $file->extension();
            $file->storeAs('avatars', $fileName, 'public');
            $user->avatar = $fileName;
        }
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil update profile',
            'data' => $user
        ], 200);
    }
}
