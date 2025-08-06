<?php

namespace App\Interface;

interface EmploymentTypeInterface
{
    public function index($request);
    public function update($request, $id);
    public function destroy($id);
    public function store($request);
}
