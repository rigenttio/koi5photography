<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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

    public function read(Request $request)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');
        $users = User::orderByDesc('created_at');
        if ($search) {
            $users->where(function ($query) use ($search) {
                $query->where('first_name', 'LIKE', "%$search%")
                    ->orWhere('last_name', 'LIKE', "%$search%");
            });
        }
        $users = $users->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $users
        ], 200);
    }

    public function updateFromAdmin(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'address' => 'required',
            'no_tlp' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore(User::findOrFail($id)),
            ],
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

        $user = User::findOrFail($id);
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'address' => $request->address,
            'no_tlp' => $request->no_tlp,
            'email' => $request->email,
        ]);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil update user',
            'data' => $user
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil delete user',
        ], 200);
    }
}
