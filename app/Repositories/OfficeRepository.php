<?php

namespace App\Repositories;

use App\Interface\OfficeInterface;
use App\Models\Office;

class OfficeRepository implements OfficeInterface
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

        return Office::when($request, function ($query) use ($search) {
            $query->where('office_name', 'like', '%' . $search . '%');
        })
            ->paginate(25)
            ->withQueryString();
    }

    public function update($request, $officeId)
    {
        $office = Office::findOrFail($officeId);
        $office->office_name = $request->office_name;
        $office->office_code = $request->office_code;
        $office->save();
    }

    public function store($request)
    {
        Office::create([
            'office_name' => $request->office_name,
            'office_code' =>  $request->office_code
        ]);
    }

    public function destroy($office)
    {
        $office->delete();
    }
}
