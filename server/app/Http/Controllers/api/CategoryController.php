<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function categoryBranch($slugBranch)
    {
        if (env('CACHE_DRIVER') == 'redis') {
            $category = Cache::tags(['branch_categories'])->remember('category_' . $slugBranch, 1440, function () use ($slugBranch) {
                $branch = Branch::where('slug', $slugBranch)->firstOrFail();
                return $branch->categories()->with('subcategories')->get();
            });
        } else {
            $branch = Branch::where('slug', $slugBranch)->firstOrFail();
            $category = $branch->categories()->with('subcategories')->get();
        }

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }

    public function categoryBranchId(Request $request)
    {
        $branch = Branch::findOrFail($request->branch_id);
        $categories = $branch->categories()->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function subcategories(Request $request)
    {
        $category = Category::findOrFail($request->category_id);
        $subcategories =  $category->subcategories()->get();

        return response()->json([
            'status' => true,
            'data' => $subcategories
        ]);
    }

    public function getCategory()
    {
        $categories = Category::all();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
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

        $category = Category::create(['name' => $request->name]);
        return response()->json([
            'status' => true,
            'message' => "berhasil buat category",
            'data' => $category
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
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

        $category = Category::findOrFail($id);

        $category->update(['name' => $request->name]);
        $category->save();
        return response()->json([
            'status' => true,
            'message' => "berhasil update category",
            'data' => $category
        ], 200);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'status' => true,
            'message' => "berhasil hapus category",
        ], 200);
    }

    public function getSubCategory()
    {
        $categories = SubCategory::all();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function storeSubCategory(Request $request)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
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

        $category = SubCategory::create(['name' => $request->name]);
        return response()->json([
            'status' => true,
            'message' => "berhasil buat category",
            'data' => $category
        ], 200);
    }

    public function updateSubCategory(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
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

        $category = SubCategory::findOrFail($id);

        $category->update(['name' => $request->name]);
        $category->save();
        return response()->json([
            'status' => true,
            'message' => "berhasil update category",
            'data' => $category
        ], 200);
    }

    public function destroySubCategory($id)
    {
        $category = SubCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'status' => true,
            'message' => "berhasil hapus category",
        ], 200);
    }

    public function SyncCategorySubCategory(Request $request, $category_id)
    {
        $category = Category::findOrFail($category_id);
        $category->subcategories()->sync($request->subcategory_ids);

        return response()->json([
            'message' => 'Sub Categories updated successfully'
        ]);
    }
}
