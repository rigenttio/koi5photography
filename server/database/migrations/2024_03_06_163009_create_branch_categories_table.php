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
        Schema::create('branch_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('branch_id');
            $table->unsignedBigInteger('category_id');

            $table->unique(['branch_id', 'category_id']);
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_categories');
    }
};
