<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlexiTime extends Model
{
    use SoftDeletes;

    protected $fillable  = [
        'employee_id',
        'time_in'
    ];
}
