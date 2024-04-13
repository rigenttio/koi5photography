<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function getByBranch(Request $request, $branchSlug)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');
        $sort = $request->input('sort');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            })->with('branch');

        if ($sort === 'desc') {
            $product->orderByDesc('price');
        } elseif ($sort === 'asc') {
            $product->orderBy('price');
        }

        $product = $product->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getByCategory(Request $request, $branchSlug, $categorySlug)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');
        $sort = $request->input('sort');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            })
            ->with('branch');

        if ($sort === 'desc') {
            $product->orderByDesc('price');
        } elseif ($sort === 'asc') {
            $product->orderBy('price');
        }

        $product = $product->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function getBySubCategory(Request $request, $branchSlug, $categorySlug, $subCategorySlug)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');
        $sort = $request->input('sort');

        $branch = Branch::where('slug', $branchSlug)->firstOrFail();
        $product = $branch->product()
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->whereHas('subcategory', function ($query) use ($subCategorySlug) {
                $query->where('slug', $subCategorySlug);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            })
            ->with('branch');

        if ($sort === 'desc') {
            $product->orderByDesc('price');
        } elseif ($sort === 'asc') {
            $product->orderBy('price');
        }

        $product = $product->paginate($perPage);

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

    public function read(Request $request)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');

        $products = Product::when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%$search%");
        })->with('branch');

        $products = $products->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'is_stock' => 'required|boolean',
        ]);

        $product = Product::findOrFail($id);
        $stock = filter_var($request->is_stock, FILTER_VALIDATE_BOOLEAN);
        $product->update([
            'is_stock' => $stock,
        ]);

        return response()->json([
            'status' => true,
            'message' => "berhasil update stock"
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'branch_id' => 'required',
            'category_id' => 'required',
            'subcategory_id' => 'nullable',
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',
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

        $product = Product::create([
            'branch_id' => $request->branch_id,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id ? $request->subcategory_id : null,
            'name' => $request->name,
            'description' => $request->description,
            'price' => intval($request->price)
        ]);

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');

            $fileName = $product->id . uniqid() . '.' . $file->extension();
            $file->storeAs('products', $fileName, 'public');
            $product->update(['thumbnail' => $fileName]);
            $product->save();
        }

        $product = Product::with('branch')->find($product->id);

        return response()->json([
            'status' => true,
            'message' => "berhasil buat produk",
            'data' => $product
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = validator($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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

        $product = Product::findOrFail($id);
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => intval($request->price),
        ]);

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');

            $existsFile = Storage::disk('public')->exists('products/' . $product->thumbnail);
            if ($existsFile) {
                Storage::disk('public')->delete('products/' . $product->thumbnail);
            }

            $fileName = $product->id . uniqid() . '.' . $file->extension();
            $file->storeAs('products', $fileName, 'public');
            $product->thumbnail = $fileName;
        }
        $product->save();

        return response()->json([
            'status' => true,
            'message' => "berhasil update produk",
            'data' => $product
        ], 200);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'status' => true,
            'message' => "berhasil hapus produk",
        ], 200);
    }
}
