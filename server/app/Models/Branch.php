<?php

namespace App\Models;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Branch extends Model
{
    use HasFactory, Sluggable;

    protected $guarded = ['id'];
    protected $table = 'branches';


    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'branch_categories', 'branch_id', 'category_id');
    }

    public function product(): HasMany
    {
        return $this->hasMany(Product::class, 'branch_id', 'id');
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'onUpdate' => true
            ]
        ];
    }
}
