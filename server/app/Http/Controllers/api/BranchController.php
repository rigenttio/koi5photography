<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class BranchController extends Controller
{
    public function read()
    {
        if (env('CACHE_DRIVER') == 'redis') {
            $branch = Cache::tags(['branch_categories'])->remember('branch', 1440, function () {
                return Branch::all();
            });
        } else {
            $branch = Branch::all();
        }

        return response()->json([
            'status' => true,
            'data' => $branch
        ], 200);
    }

    public function getBranch()
    {
        $branch = Branch::all();

        return response()->json([
            'status' => true,
            'data' => $branch
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
            'googlemap_url' => 'required',
            'address' => 'required',
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

        $branch = Branch::create([
            'name' => $request->name,
            'googlemap_url' => $request->googlemap_url,
            'address' => $request->address
        ]);

        return response()->json([
            'status' => true,
            'data' => $branch
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
            'googlemap_url' => 'required',
            'address' => 'required',
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

        $branch = Branch::findOrFail($id);
        $branch->update([
            'name' => $request->name,
            'googlemap_url' => $request->googlemap_url,
            'address' => $request->address
        ]);
        $branch->save();

        return response()->json([
            'status' => true,
            'data' => $branch
        ], 200);
    }

    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        return response()->json([
            'status' => true,
            'data' => 'berhasil menghapus'
        ], 200);
    }

    public function syncBranchCategory(Request $request, $branchId)
    {
        $branch = Branch::findOrFail($branchId);
        $branch->categories()->sync($request->category_ids);

        return response()->json([
            'message' => 'Categories updated successfully'
        ]);
    }
}
