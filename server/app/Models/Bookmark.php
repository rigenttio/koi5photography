<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'product_id', 'created_at'];
    protected $table = 'bookmarks';
    protected $casts = [
        'created_at' => 'datetime:Y-m-d\TH:i:s.u\Z',
    ];

    protected static function boot()
    {
        parent::boot();
        static::attaching(function ($bookmark) {
            $bookmark->created_at = now();
        });
    }
}
