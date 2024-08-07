<?php

namespace App\Http\Controllers\api;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function read()
    {
        $admins = Admin::with('branch')->get();

        return response()->json([
            'status' => true,
            'data' => $admins
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'password' => 'required',
            'role' => 'required',
            'branch_id' => 'nullable',
            'email' => [
                'required',
                'email',
                Rule::unique('admins'),
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

        $admin = Admin::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'branch_id' => $request->branch_id
        ]);

        return response()->json([
            'status' => true,
            'data' => $admin
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'password' => 'nullable',
            'role' => 'required',
            'branch_id' => 'nullable',
            'email' => [
                'required',
                'email',
                Rule::unique('admins')->ignore($id),
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

        $admin = Admin::findOrFail($id);
        $admin->update([
            'email' => $request->email,
            'role' => $request->role,
            'branch_id' => $request->branch_id
        ]);
        if ($request->filled('password')) {
            $admin->password = Hash::make($request->password);
        }
        $admin->save();
        $admin->load('branch');

        return response()->json([
            'status' => true,
            'data' => $admin
        ], 200);
    }

    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        return response()->json([
            'status' => true,
            'data' => $admin
        ], 200);
    }
}
