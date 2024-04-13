<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
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
}
