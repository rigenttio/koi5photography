<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getByBranch($branchSlug)
    {
        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()->with('branch')->get();

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getByCategory($branchSlug, $categorySlug)
    {
        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->with('branch')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getBySubCategory($branchSlug, $categorySlug, $subCategorySlug)
    {
        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('subcategory', function ($query) use ($subCategorySlug) {
                $query->where('slug', $subCategorySlug);
            })
            ->with('branch')
            ->get();

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
