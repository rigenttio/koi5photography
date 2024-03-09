<?php

namespace App\Providers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\SubCategory;
use App\Observers\BranchObserver;
use App\Observers\CategoryObserver;
use App\Observers\SubCategoryObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        Branch::observe(BranchObserver::class);
        Category::observe(CategoryObserver::class);
        SubCategory::observe(SubCategoryObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
