<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable  = [
        'office_id',
        'fingerprint_id',
        'name',
        'is_active',
        'employment_type_id'
    ];

    public function Logs(): HasMany
    {
        return $this->hasMany(Log::class, 'fingerprint_id', 'fingerprint_id');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class, 'office_id', 'id');
    }

    public function employmentType(): BelongsTo
    {
        return $this->belongsTo(EmploymentType::class, 'employment_type_id', 'id');
    }

    public function flexiTime(): HasOne
    {
        return $this->hasOne(FlexiTime::class, 'employee_id', 'id');
    }

    public function nightShift(): HasOne
    {
        return $this->hasOne(NightShift::class, 'employee_id', 'id');
    }
}
