<?php

namespace App\Repositories;

use App\Interface\EmploymentTypeInterface;
use App\Models\EmploymentType;

class EmploymentTypeRepository implements EmploymentTypeInterface
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
        $search = $request->input('search');

        return EmploymentType::when($request, function ($query) use ($search) {
            $query->where('employment_type', 'like', '%' . $search . '%');
        })
            ->paginate(25)
            ->withQueryString();
    }

    public function update($request, $id)
    {
        $employmentType = EmploymentType::findOrFail($id);
        $employmentType->employment_type  = $request->employment_type;
        $employmentType->save();
    }

    public function destroy($id)
    {
        $employmentType = EmploymentType::findOrFail($id);
        $employmentType->delete();
    }

    public function store($request)
    {
        EmploymentType::create([
            'employment_type' => $request->employment_type,
        ]);
    }
}
