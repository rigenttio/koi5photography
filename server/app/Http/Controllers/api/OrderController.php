<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = validator($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required',
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
        $totalPrice = $request->quantity * $product->price;

        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'total_price' => $totalPrice,
            'quantity' => $request->quantity,
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

    public function getOrderNoPaid()
    {
        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'belum bayar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderPaid()
    {
        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'dibayar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderTake()
    {
        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'diambil')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderDone()
    {
        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'selesai')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
    }

    public function getOrderCancel()
    {
        $user = User::findOrFail(auth()->id());

        $order = $user->order()
            ->with('product.branch')
            ->where('status', 'refund')
            ->orWhere('status', 'dibatalkan')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $order
        ], 200);
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
            'exp_take' => ($order->status !== "dibayar") && ($status === "dibayar") ? $date : $order->exp_take,
            'cancel_at' => ($order->status !== "dibatalkan" || $order->status !== "refund")
                && ($status === "dibatalkan" || $status === "refund") ? $date : $order->cancel_at,
        ]);
        $order->save();

        return response()->json(['message' => $status], 200);
    }
}
