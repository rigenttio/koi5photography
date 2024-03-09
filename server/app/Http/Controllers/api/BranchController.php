<?php

namespace App\Http\Controllers\api;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class BranchController extends Controller
{
    public function read()
    {
        $branch = Cache::tags(['branch_categories'])->remember('branch', 1440, function () {
            return Branch::all();
        });

        return response()->json([
            'status' => true,
            'data' => $branch
        ], 200);
    }
}
