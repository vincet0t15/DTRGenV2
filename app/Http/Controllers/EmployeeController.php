<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest\EmployeeStoreRequest;
use App\Http\Requests\EmployeeRequest\EmployeeUpdateRequest;
use App\Http\Requests\EmployeeRequest\EmployeeUpdteRequest;
use App\Imports\EmployeeImport;
use App\Models\Employee;
use App\Models\EmploymentType;
use App\Models\FlexiTime;
use App\Models\NightShift;
use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->input('search');
        $filterTypes = $request['filterTypes'];

        $employmentTypes = EmploymentType::all();
        $offices = Office::all();

        $employees = Employee::when($search, function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('fingerprint_id', 'like', '%' . $search . '%');
            });
        })
            ->when(!empty($filterTypes), function ($query) use ($filterTypes) {
                $query->whereIn('employment_type_id', $filterTypes);
            })
            ->with('office', 'employmentType', 'flexiTime', 'nightShift')
            ->orderBy('name', 'asc')
            ->paginate(100)
            ->withQueryString();


        return Inertia::render('Employee/index', [
            'employees' => $employees,
            'employmentTypes' => $employmentTypes,
            'offices' => $offices,
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

    public function update(EmployeeUpdateRequest $request, int $employeeId)
    {

        $employee = Employee::findOrFail($employeeId);
        $employee->name = $request->name;
        $employee->fingerprint_id = $request->fingerprint_id;
        $employee->employment_type_id = $request->employment_type_id;
        $employee->office_id = $request->office_id;
        $employee->save();

        if ($request->flexi_time_in &&  $request->flexi_time_out) {
            FlexiTime::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                ],
                [
                    'time_in' => $request->flexi_time_in,
                    'time_out' => $request->flexi_time_out
                ],

            );
        }

        NightShift::updateOrCreate(
            ['employee_id' => $employee->id],
            ['is_nightshift' => $request->nightShift]
        );

        return redirect()->back()->with('success', 'Employee successfully updated.');
    }

    public function store(EmployeeStoreRequest $request)
    {
        $employee =  Employee::create([
            'name' => $request->name,
            'fingerprint_id' => $request->fingerprint_id,
            'office_id' => $request->office_id,
            'employment_type_id' => $request->employment_type_id,
        ]);


        if ($request->flexi_time_in &&  $request->flexi_time_out) {
            FlexiTime::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                ],
                [
                    'time_in' => $request->flexi_time_in,
                    'time_out' => $request->flexi_time_out
                ],

            );
        }

        if ($request->nightShift) {
            NightShift::updateOrCreate(
                ['employee_id' => $employee->id],
                ['is_nightshift' => $request->nightShift]
            );
        }


        return redirect()->back()->with('success', 'Employee successfully added.');
    }

    public function destroy(int $employeeId)
    {
        Employee::findOrFail($employeeId)->delete();

        return redirect()->back()->with('success', 'Employee successfully deleted.');
    }

    public function deleteFlexiTime(int $id)
    {
        FlexiTime::findOrFail($id)->delete();

        return redirect()->back()->withSuccess('Flexitime Successfully deleted');
    }
}
