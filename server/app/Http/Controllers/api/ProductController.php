<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getByBranch(Request $request, $branchSlug)
    {
        $perPage = $request->input('perPage');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()->with('branch')->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getByCategory(Request $request, $branchSlug, $categorySlug)
    {
        $perPage = $request->input('perPage');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->with('branch')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getBySubCategory(Request $request, $branchSlug, $categorySlug, $subCategorySlug)
    {
        $perPage = $request->input('perPage');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('subcategory', function ($query) use ($subCategorySlug) {
                $query->where('slug', $subCategorySlug);
            })
            ->with('branch')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function show($productSlug)
    {
        $product = Product::with('branch')->where('slug', $productSlug)->firstOrFail();
        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function test($productSlug)
    {
        $product = Product::with('branch')->where('slug', $productSlug)->firstOrFail();
        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }
}
