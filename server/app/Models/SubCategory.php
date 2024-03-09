<?php

namespace App\Models;

use App\Models\Product;
use App\Models\Category;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SubCategory extends Model
{
    use HasFactory, Sluggable;

    protected $guarded = ['id'];
    protected $table = 'subcategories';

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_subcategories', 'subcategory_id', 'category_id');
    }

    public function product(): HasMany
    {
        return $this->hasMany(Product::class, 'subcategory_id', 'id');
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }
}
