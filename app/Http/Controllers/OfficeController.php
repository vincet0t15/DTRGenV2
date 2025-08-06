<?php

namespace App\Http\Controllers;

use App\Http\Requests\OfficeRequest\OfficeStoreRequest;
use App\Http\Requests\OfficeRequest\OfficeUpdateRequest;
use App\Interface\OfficeInterface;
use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeController extends Controller
{
    protected $officeInterface;

    public function __construct(OfficeInterface $officeInterface)
    {
        $this->officeInterface = $officeInterface;
    }

    public function index(Request $request)
    {
        $offices = $this->officeInterface->index($request);

        return Inertia::render('Office/index', [
            'offices' => $offices,
            'filters' => $request->only('search')
        ]);
    }

    public function update(OfficeUpdateRequest $request, int $officeId)
    {
        $this->officeInterface->update($request, $officeId);

        return back()->withSuccess('Office updated successfully');
    }

    public function destroy(Office $office)
    {
        $this->officeInterface->destroy($office);

        return back()->withSuccess('Office deleted successfully');
    }

    public function store(OfficeStoreRequest $request)
    {

        $this->officeInterface->store($request);

        return back()->withSuccess('Office created successfully');
    }
}
