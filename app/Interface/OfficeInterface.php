<?php

namespace App\Interface;

interface OfficeInterface
{
    public function index($request);
    public function store($request);
    public function update($request, $officeId);
    public function destroy($office);
}
