<?php

namespace App\Observers;

use App\Models\Branch;
use Illuminate\Support\Facades\Cache;

class BranchObserver
{
    /**
     * Handle the Branch "created" event.
     */
    public function created(Branch $branch): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the Branch "updated" event.
     */
    public function updated(Branch $branch): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the Branch "deleted" event.
     */
    public function deleted(Branch $branch): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the Branch "restored" event.
     */
    public function restored(Branch $branch): void
    {
        $this->clearCategoryCache();
    }

    /**
     * Handle the Branch "force deleted" event.
     */
    public function forceDeleted(Branch $branch): void
    {
        $this->clearCategoryCache();
    }

    protected function clearCategoryCache()
    {
        Cache::tags(['branch_categories'])->flush();
    }
}
