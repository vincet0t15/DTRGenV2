<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmploymentTypeController;
use App\Http\Controllers\OfficeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    // employee
    Route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
    Route::put('/employee-update/{employeeId}', [EmployeeController::class, 'update'])->name('employee.update');
    Route::post('/employee-import', [EmployeeController::class, 'import'])->name('employee.import');
    Route::put('/employee-update-status/{employee_id}', [EmployeeController::class, 'updateStatus'])->name('employee.update.status');

    // OFFICES
    Route::get('/offices', [OfficeController::class, 'index'])->name('office.index');
    Route::post('/offices-store', [OfficeController::class, 'store'])->name('office.store');
    Route::put('/offices-update/{officeId}', [OfficeController::class, 'update'])->name('office.update');
    Route::delete('/offices-destroy/{office}', [OfficeController::class, 'destroy'])->name('office.destroy');

    //EMPLOYMENT TYPES
    Route::get('/employment-types', [EmploymentTypeController::class, 'index'])->name('employment.index');
    Route::post('/employment-types-store', [EmploymentTypeController::class, 'store'])->name('employment.store');
    Route::put('/employment-types-update/{id}', [EmploymentTypeController::class, 'update'])->name('employment.update');
    Route::delete('/employment-types-destroy/{id}', [EmploymentTypeController::class, 'destroy'])->name('employment.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
