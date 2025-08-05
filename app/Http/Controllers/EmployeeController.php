<?php

namespace App\Http\Controllers;

use App\Imports\EmployeeImport;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->input('search');
        $filterTypes = $request['filterTypes'];


        $employees = Employee::when($search, function ($query) use ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        })
            ->when(!empty($filterTypes), function ($query) use ($filterTypes) {
                $query->whereIn('is_permanent', $filterTypes);
            })
            ->with('office')
            ->orderBy('name', 'asc')
            ->paginate(100)
            ->withQueryString();

        return Inertia::render('Employee/index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'filterTypes' => $filterTypes,
            ],
        ]);
    }

    public function import(Request $request)
    {
        Excel::import(new EmployeeImport(), $request->file('file'));

        return redirect()->back()->withSuccess('Data Successfully imported');
    }

    public function updateStatus(int $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);
        $employee->is_active = !$employee->is_active;
        $employee->save();

        return redirect()->back()->with('success', 'Status updated.');
    }
}
