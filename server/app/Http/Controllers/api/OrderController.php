<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
use PhpParser\Node\Stmt\TryCatch;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required',
            'start_date' => 'required',
            'end_date' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errorType' => 'validation',
                'message' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail(auth()->id());
        $product = Product::findOrFail($request->product_id);
        if (!$product->is_stock) {
            return response()->json([
                'status' => false,
                'message' => 'stock tidak tersedia'
            ], 400);
        }

        $totalPrice = $request->quantity * $product->price;

        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'total_price' => $totalPrice,
            'quantity' => $request->quantity,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'exp_pay' => Carbon::now()->addHours(24)
        ]);

        $params = array(
            "transaction_details" => array(
                "order_id" => $order->id,
                "gross_amount" => $totalPrice
            ),
            "item_details" => array(
                array(
                    "price" => $product->price,
                    "quantity" => $request->quantity,
                    "name" => $product->name,
                )
            ),
            "customer_details" => array(
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "email" => $user->email,
                "phone" => $user->no_tlp,
            ),
            "callbacks" => array(
                "finish" => env('APP_URL_CLIENT') . "/purchase",
                "error" => env('APP_URL_CLIENT') . "/purchase",
                "pending" => env('APP_URL_CLIENT') . "/purchase"
            ),
            "expiry" => array(
                "unit" => "hour",
                "duration" => 24
            )
        );

        $authMidtrans = base64_encode(env('MIDTRANS_SERVER_KEY'));

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Basic $authMidtrans"
        ])->post(env('MIDTRANS_BASE_URL') . "/snap/v1/transactions", $params);

        $result = $response->json();

        $order->update([
            'token_snap' => $result['token']
        ]);
        $order->save();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil order'
        ], 200);
    }

    public function getOrderNoPaid(Request $request)
    {
        $perPage = $request->input('perPage');

        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'belum bayar')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderPaid(Request $request)
    {
        $perPage = $request->input('perPage');

        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'dibayar')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderTake(Request $request)
    {
        $perPage = $request->input('perPage');

        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'diambil')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $order->getCollection()->transform(function ($order) {
            $now = Carbon::now();
            $expRent = Carbon::parse($order->exp_rent);
            $denda = 0;

            if ($now->greaterThan($expRent)) {
                $hoursLate = $now->diffInHours($expRent);
                $denda = $hoursLate * ($order->product->price * 0.10);
            }
            $order->denda = $denda;
            return $order;
        });

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderDone(Request $request)
    {
        $perPage = $request->input('perPage');

        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'selesai')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderCancel(Request $request)
    {
        $perPage = $request->input('perPage');

        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'refund')
            ->orWhere('status', 'dibatalkan')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderByBranch(Request $request, $branchSlug)
    {
        $perPage = $request->input('perPage');
        $search = $request->input('search');
        $branch = Branch::where('slug', $branchSlug)->firstOrFail();

        $orders = Order::whereHas('product', function ($query) use ($branch) {
            $query->where('branch_id', $branch->id);
        })->when($search, function ($query) use ($search) {
            $query->where('id', $search);
        })
            ->with('product', 'user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $orders->getCollection()->transform(function ($order) {
            $now = Carbon::now();
            $expRent = Carbon::parse($order->exp_rent);
            $denda = 0;

            if ($now->greaterThan($expRent) && $order->status == "diambil") {
                $hoursLate = $now->diffInHours($expRent);
                $denda = $hoursLate * ($order->product->price * 0.10);
            }
            $order->denda = $denda;
            return $order;
        });

        return response()->json([
            'status' => true,
            'data' => $orders
        ], 200);
    }

    public function read(Request $request)
    {
        $perPage = $request->input('perPage');

        $orders = Order::with('product.branch', 'user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $orders
        ], 200);
    }

    public function markTake($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === "dibayar") {
            $endDate = Carbon::parse($order->end_date)->format('Y-m-d');
            $currentTime = now()->format('H:i:s');

            $expRent = Carbon::parse("$endDate $currentTime");
            $order->update([
                'status' => "diambil",
                'exp_rent' => $expRent
            ]);
            $order->save();

            return response()->json([
                'status' => true,
                'message' => "berhasil tandai diambil"
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => "terjadi kesalahan"
            ], 400);
        }
    }

    public function markDone($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === "diambil") {
            $order->update([
                'status' => "selesai",
                'done_at' => Carbon::now()
            ]);
            $order->save();

            return response()->json([
                'status' => true,
                'message' => "berhasil tandai selesai"
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => "terjadi kesalahan"
            ], 400);
        }
    }

    public function cancel($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === "dibatalkan") {
            return response()->json([
                'status' => false,
                'message' => "terjadi kesalahan"
            ], 400);
        }

        $order->update([
            'status' => "dibatalkan",
            'cancel_at' => Carbon::now()
        ]);
        $order->save();

        return response()->json([
            'status' => true,
            'message' => "berhasil dibatalkan"
        ], 200);
    }

    public function refund($id)
    {
        $order = Order::findOrFail($id);
        $authMidtrans = base64_encode(env('MIDTRANS_SERVER_KEY'));

        if ($order->status === "dibatalkan" || $order->status === "refund" || !$order->transaction_status) {
            return response()->json([
                'status' => false,
                'message' => "terjadi kesalahan"
            ], 400);
        }

        if ($order->transaction_status === "settlement") {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "Basic $authMidtrans"
            ])->post(env('MIDTRANS_BASE_API_URL') . "/v2/$order->id/refund");
            if ($response->successful()) {
                return response()->json([
                    'status' => true,
                    'message' => "berhasil refund"
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => "terjadi kesalahan"
                ], 500);
            }
            return response()->json([
                'status' => true,
                'message' => "berhasil refund"
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => "terjadi kesalahan"
            ], 400);
        }
    }

    public function webhook(Request $request)
    {
        $authMidtrans = base64_encode(env('MIDTRANS_SERVER_KEY'));

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Basic $authMidtrans"
        ])->get(env('MIDTRANS_BASE_API_URL') . "/v2/$request->order_id/status");

        $result = $response->json();

        $order = Order::findOrFail($result["order_id"]);

        switch ($result["transaction_status"]) {
            case "capture":
            case "settlement":
                $status = "dibayar";
                $date = Carbon::now()->addHours(24);
                break;
            case "pending":
                $status = "belum bayar";
                $date = Carbon::now()->addHours(24);
                break;
            case "deny":
            case "cancel":
            case "expire":
                $status = "dibatalkan";
                $date = Carbon::now();
                break;
            case "refund":
                $status = "refund";
                $date = Carbon::now();
                break;
            default:
                return response()->json(['error' => 'Invalid transaction status'], 400);
        }

        $order->update([
            'status' => $status,
            'transaction_status' => $result["transaction_status"],
            'exp_pay' => ($order->status !== "belum bayar") && ($status === "belum bayar") ? $date : $order->exp_pay,
            'cancel_at' => ($order->status !== "dibatalkan" || $order->status !== "refund")
                && ($status === "dibatalkan" || $status === "refund") ? $date : $order->cancel_at,
        ]);
        $order->save();

        return response()->json(['message' => $status], 200);
    }
}
