<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BookmarkController extends Controller
{
    public function read()
    {
        $user = User::findOrFail(auth()->id());
        $bookmarks = $user->bookmarks()
            ->with('branch')
            ->latest('bookmarks.created_at')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $bookmarks
        ], 200);
    }

    public function store($productId)
    {
        $user = User::findOrFail(auth()->id());
        $product = Product::findOrFail($productId);
        $user->bookmarks()->attach($product->id);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil menambah bookmark'
        ], 200);
    }

    public function destroy($productId)
    {
        $user = User::findOrFail(auth()->id());
        $product = Product::findOrFail($productId);
        $user->bookmarks()->detach($product->id);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil menghapus bookmark'
        ], 200);
    }
}
