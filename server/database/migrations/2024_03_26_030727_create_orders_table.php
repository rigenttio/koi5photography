<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->enum('status', ['belum bayar', 'dibayar', 'diambil', 'selesai', 'refund', 'dibatalkan'])->default('belum bayar');
            $table->bigInteger('total_price')->nullable();
            $table->integer('quantity')->nullable();
            $table->string('token_snap')->nullable();
            $table->timestamp('exp_pay')->nullable();
            $table->timestamp('exp_take')->nullable();
            $table->timestamp('exp_rent')->nullable();
            $table->timestamp('done_at')->nullable();
            $table->timestamp('cancel_at')->nullable();
            $table->string('transaction_status')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
