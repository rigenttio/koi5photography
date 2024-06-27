<?php

namespace App\Models;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'exp_pay' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'exp_take' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'exp_rent' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'done_at' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'cancel_at' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'start_date' => 'datetime:Y-m-d\TH:i:s.u\Z',
        'end_date' => 'datetime:Y-m-d\TH:i:s.u\Z',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($self) {
            $self->id = generateUuid(12, 'invoice-', 'orders');
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
