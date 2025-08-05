<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Log extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'fingerprint_id',
        'date_time',
        'data1',
        'data2',
        'data3',
        'data4'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'fingerprint_id', 'fingerprint_id');
    }
}
