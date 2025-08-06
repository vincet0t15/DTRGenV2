<?php

namespace App\Repositories;

use App\Interface\DTRInterface;
use App\Models\Employee;
use App\Models\EmploymentType;
use App\Models\Office;

class DTRRepository implements DTRInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index($request)
    {

        $search = $request->input('data.search');
        $employmentTypeId = $request->input('data.employment_type_id');

        $employees = Employee::when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('fingerprint_id', 'like', '%' . $search . '%');
            });
        })
            ->when($employmentTypeId, function ($query) use ($employmentTypeId) {
                $query->where('employment_type_id', $employmentTypeId);
            })
            ->with('office', 'employmentType')
            ->orderBy('name', 'asc')
            ->paginate(100)
            ->withQueryString();

        return [
            'employees' => $employees,
            'employmentTypes' => EmploymentType::all(),
            'offices' => Office::all(),
        ];
    }
}
