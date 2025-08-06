<?php

namespace App\Providers;

use App\Interface\EmploymentTypeInterface;
use App\Interface\OfficeInterface;
use App\Repositories\EmploymentTypeRepository;
use App\Repositories\OfficeRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(OfficeInterface::class, OfficeRepository::class);
        $this->app->bind(EmploymentTypeInterface::class, EmploymentTypeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
