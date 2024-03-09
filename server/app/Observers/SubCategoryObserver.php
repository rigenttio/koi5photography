<?php

namespace App\Observers;

use App\Models\SubCategory;
use Illuminate\Support\Facades\Cache;

class SubCategoryObserver
{
    /**
     * Handle the SubCategory "created" event.
     */
    public function created(SubCategory $subCategory): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the SubCategory "updated" event.
     */
    public function updated(SubCategory $subCategory): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the SubCategory "deleted" event.
     */
    public function deleted(SubCategory $subCategory): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the SubCategory "restored" event.
     */
    public function restored(SubCategory $subCategory): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the SubCategory "force deleted" event.
     */
    public function forceDeleted(SubCategory $subCategory): void
    {
        $this->clearCategoryCache();
    }

    protected function clearCategoryCache()
    {
        Cache::tags(['branch_categories'])->flush();
    }
}
