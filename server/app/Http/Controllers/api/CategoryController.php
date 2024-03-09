<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function categoryBranch($slugBranch)
    {
        $category = Cache::tags(['branch_categories'])->remember('category_' . $slugBranch, 1440, function () use ($slugBranch) {
            $branch = Branch::where('slug', $slugBranch)->first();
            return $branch->categories()->with('subcategories')->get();
        });

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }
}
