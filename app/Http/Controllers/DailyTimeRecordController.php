<?php

namespace App\Http\Controllers;

use App\Interface\DTRInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyTimeRecordController extends Controller
{

    protected $dTRInterface;

    public function __construct(DTRInterface $dTRInterface)
    {
        $this->dTRInterface = $dTRInterface;
    }

    public function index(Request $request)
    {
        $data = $this->dTRInterface->index($request);

        return Inertia::render('DTR/index', [
            'employees' => $data['employees'],
            'employmentTypes' => $data['employmentTypes'],
            'offices' => $data['offices'],
            'filters' => [
                'search' => $request->input('search'),
                'filterTypes' => $request->input('filterTypes'),
            ],
        ]);
    }
}
