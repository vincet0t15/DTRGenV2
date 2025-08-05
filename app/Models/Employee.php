<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable  = [
        'office_id',
        'fingerprint_id',
        'name',
        'is_active',
        'is_permanent'
    ];

    public function Logs(): HasMany
    {
        return $this->hasMany(Log::class, 'fingerprint_id', 'fingerprint_id');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class, 'office_id', 'id');
    }
}
