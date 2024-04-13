<?php

namespace App\Models;

use App\Models\Branch;
use App\Models\Product;
use App\Models\SubCategory;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory, Sluggable;

    protected $guarded = ['id'];
    protected $table = 'categories';


    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'branch_categories', 'category_id', 'branch_id');
    }

    public function subcategories(): BelongsToMany
    {
        return $this->belongsToMany(SubCategory::class, 'category_subcategories', 'category_id', 'subcategory_id');
    }

    public function product(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
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
