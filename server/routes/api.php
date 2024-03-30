<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\BookmarkController;
use App\Http\Controllers\api\BranchController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\ContactController;
use App\Http\Controllers\api\OrderController;
use App\Http\Controllers\api\PasswordController;
use App\Http\Controllers\api\RegisterController;
use App\Http\Controllers\api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [RegisterController::class, 'register']);
Route::patch('/verify-email', [RegisterController::class, 'verifyEmail']);

Route::post('/forgot-password', [PasswordController::class, 'forgotPassword']);
Route::patch('/reset-password', [PasswordController::class, 'resetPassword']);

Route::get('/branch', [BranchController::class, 'read']);
Route::get('/category/{slugBranch}', [CategoryController::class, 'categoryBranch']);

Route::get('/category', [CategoryController::class, 'get']);

Route::post('/contact', [ContactController::class, 'sendContact']);

Route::post('/webhooks/midtrans', [OrderController::class, 'webhook']);


Route::get('/product/{productSlug}', [ProductController::class, 'show']);
Route::get('/product/get_by_branch/{branchSlug}', [ProductController::class, 'getByBranch']);
Route::get('/product/get_by_category/{branchSlug}/{categorySlug}', [ProductController::class, 'getByCategory']);
Route::get('/product/get_by_subcategory/{branchSlug}/{categorySlug}/{subCategorySlug}', [ProductController::class, 'getBySubCategory']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/order', [OrderController::class, 'store']);
    Route::get('/order/no_paid', [OrderController::class, 'getOrderNoPaid']);
    Route::get('/order/paid', [OrderController::class, 'getOrderPaid']);
    Route::get('/order/take', [OrderController::class, 'getOrderTake']);
    Route::get('/order/done', [OrderController::class, 'getOrderDone']);
    Route::get('/order/cancel', [OrderController::class, 'getOrderCancel']);

    Route::put('/user', [UserController::class, 'update']);

    Route::get('/bookmark', [BookmarkController::class, 'read']);
    Route::post('/bookmark/{productId}', [BookmarkController::class, 'store']);
    Route::delete('/bookmark/{productId}', [BookmarkController::class, 'destroy']);
});
