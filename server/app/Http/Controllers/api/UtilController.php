<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class UtilController extends Controller
{
    public function count()
    {
        $admin = auth()->user();
        if ($admin->role == "admin") {
            $countBelumBayar = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where('status', 'belum bayar')->count();

            $countDibayar = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where('status', 'dibayar')->count();

            $countDiambil = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where('status', 'diambil')->count();

            $countSelesai = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where('status', 'selesai')->count();

            $countDibatalkan = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where(function ($query) {
                $query->where('status', 'dibatalkan')
                    ->orWhere('status', 'refund');
            })->count();

            $countUsers = User::count();

            $countProducts = Product::where('branch_id', $admin->branch_id)->count();

            $sumPendapatan = Order::whereHas('product', function ($query) use ($admin) {
                $query->where('branch_id', $admin->branch_id);
            })->where('status', 'selesai')->sum('total_price');
        } else {
            $countBelumBayar = Order::where('status', 'belum bayar')->count();
            $countDibayar = Order::where('status', 'dibayar')->count();
            $countDiambil = Order::where('status', 'diambil')->count();
            $countSelesai = Order::where('status', 'selesai')->count();
            $countDibatalkan = Order::where('status', 'dibatalkan')->orWhere('status', 'refund')->count();
            $countUsers = User::count();
            $countProducts = Product::count();
            $sumPendapatan = Order::where('status', 'selesai')->sum('total_price');
        }


        return response()->json([
            'status' => true,
            'data' => [
                'no_paid' => $countBelumBayar,
                'paid' => $countDibayar,
                'take' => $countDiambil,
                'done' => $countSelesai,
                'cancel' => $countDibatalkan,
                'users' => $countUsers,
                'products' => $countProducts,
                'pendapatan' => $sumPendapatan
            ],
        ], 200);
    }
}
