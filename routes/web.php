<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // employee

    Route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
    Route::post('/employee-import', [EmployeeController::class, 'import'])->name('employee.import');
    Route::put('/employee-update-status/{employee_id}', [EmployeeController::class, 'updateStatus'])->name('employee.update.status');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
