<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmploymentType\EmploymentTypeStoreRequest;
use App\Http\Requests\EmploymentType\EmploymentTypeUpdateRequest;
use App\Interface\EmploymentTypeInterface;
use App\Models\FlexiTime;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmploymentTypeController extends Controller
{

    protected $employmentTypeInterface;

    public function __construct(EmploymentTypeInterface $employmentTypeInterface)
    {
        $this->employmentTypeInterface  = $employmentTypeInterface;
    }

    public function index(Request $request)
    {
        $employmentTypes = $this->employmentTypeInterface->index($request);

        return Inertia::render('EmploymentType/index', [
            'employmentTypes' => $employmentTypes,
            'filters' => $request->only('search')
        ]);
    }

    public function update(EmploymentTypeUpdateRequest $request, $id)
    {
        $this->employmentTypeInterface->update($request, $id);

        return redirect()->back()->withSuccess('Employment Type Successfully updated');
    }

    public function destroy(int $id)
    {
        $this->employmentTypeInterface->destroy($id);

        return redirect()->back()->withSuccess('Employment Type Successfully deleted');
    }

    public function store(EmploymentTypeStoreRequest $request)
    {
        $this->employmentTypeInterface->store($request);

        return redirect()->back()->withSuccess('Employment Type Successfully created');
    }
}
