<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

if (!function_exists('generateUuid')) {
    function generateUuid($digit, $prefix, $table, $randomLastStr = false, $lengthStr = 2)
    {
        global $usedNumbers;

        if (!isset($usedNumbers)) {
            $usedNumbers = [];
        }

        do {
            if (count($usedNumbers) >= 10000) {
                return null;
            }

            $uniqueNumber = random_int(100000000000, 999999999999);
            $uuid = $prefix . $uniqueNumber;

            if ($randomLastStr) {
                $randomSuffix = strtoupper(preg_replace("/[^A-Za-z]/", '', Str::random($lengthStr)));
                $randomSuffix = str_pad($randomSuffix, $lengthStr, 'X', STR_PAD_RIGHT);
                $randomSuffix = substr($randomSuffix, 0, $lengthStr);
                $uuid .= $randomSuffix;
            }

            $isUsed = DB::table($table)->where('id', $uuid)->exists();
        } while (in_array($uuid, $usedNumbers) || $isUsed);

        $usedNumbers[] = $uuid;

        return $uuid;
    }
}
