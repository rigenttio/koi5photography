<?php

use App\Http\Controllers\api\AdminAuthController;
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
use App\Http\Controllers\api\UtilController;

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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::post('/register', [RegisterController::class, 'register']);
Route::patch('/verify-email', [RegisterController::class, 'verifyEmail']);

Route::post('/forgot-password', [PasswordController::class, 'forgotPassword']);
Route::patch('/reset-password', [PasswordController::class, 'resetPassword']);

Route::get('/branch', [BranchController::class, 'read']);
Route::get('/category/{slugBranch}', [CategoryController::class, 'categoryBranch']);

Route::get('/category', [CategoryController::class, 'get']);
Route::get('/categories', [CategoryController::class, 'categoryBranchId']);
Route::get('/subcategories', [CategoryController::class, 'subcategories']);

Route::post('/contact', [ContactController::class, 'sendContact']);

Route::post('/webhooks/midtrans', [OrderController::class, 'webhook']);

Route::get('/product/{productSlug}', [ProductController::class, 'show']);
Route::get('/product/get_by_branch/{branchSlug}', [ProductController::class, 'getByBranch']);
Route::get('/product/get_by_category/{branchSlug}/{categorySlug}', [ProductController::class, 'getByCategory']);
Route::get('/product/get_by_subcategory/{branchSlug}/{categorySlug}/{subCategorySlug}', [ProductController::class, 'getBySubCategory']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/change-password', [PasswordController::class, 'changePassword']);

    Route::post('/order', [OrderController::class, 'store']);
    Route::get('/order/no_paid', [OrderController::class, 'getOrderNoPaid']);
    Route::get('/order/paid', [OrderController::class, 'getOrderPaid']);
    Route::get('/order/take', [OrderController::class, 'getOrderTake']);
    Route::get('/order/done', [OrderController::class, 'getOrderDone']);
    Route::get('/order/cancel', [OrderController::class, 'getOrderCancel']);
    Route::patch('/order/cancel/{id}', [OrderController::class, 'cancel']);

    Route::put('/user', [UserController::class, 'update']);

    Route::get('/bookmark', [BookmarkController::class, 'read']);
    Route::post('/bookmark/{productId}', [BookmarkController::class, 'store']);
    Route::delete('/bookmark/{productId}', [BookmarkController::class, 'destroy']);
});

//admin route
Route::middleware('auth:sanctum', 'admin')->group(function () {
    Route::post('admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);
    Route::get('/order/get_by_branch/{branchSlug}', [OrderController::class, 'getOrderByBranch']);
    Route::get('/order', [OrderController::class, 'read']);
    Route::patch('/order/mark-take/{id}', [OrderController::class, 'markTake']);
    Route::patch('/order/mark-done/{id}', [OrderController::class, 'markDone']);

    Route::get('/dashboard/count', [UtilController::class, 'count']);

    Route::get('/user', [UserController::class, 'read']);
    Route::put('/user/{id}', [UserController::class, 'updateFromAdmin']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    Route::get('/product', [ProductController::class, 'read']);
    Route::patch('/product/{id}/stock', [ProductController::class, 'updateStock']);
    Route::post('/product', [ProductController::class, 'store']);
    Route::put('/product/{id}', [ProductController::class, 'update']);
    Route::delete('/product/{id}', [ProductController::class, 'destroy']);
});
