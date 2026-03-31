<?php

namespace App\Imports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\DB;

class LogsImport implements ToModel, WithHeadingRow, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Skip rows with empty or null fingerprint_id
        if (empty($row['fingerprint_id'])) {
            return null;
        }

        // Convert Excel serial date to Y-m-d H:i:s
        if (is_numeric($row['date_time'])) {
            $convertedDate = Date::excelToDateTimeObject($row['date_time'])->format('Y-m-d H:i:s');
        } else {
            $convertedDate = date('Y-m-d H:i:s', strtotime($row['date_time']));
        }

        // Check if record already exists
        $exists = Log::where('fingerprint_id', $row['fingerprint_id'])
            ->where('date_time', $convertedDate)
            ->exists();

        if ($exists) {
            // Skip if already exists
            return null;
        }

        // Create new record
        return new Log([
            'fingerprint_id' => $row['fingerprint_id'],
            'date_time'      => $convertedDate,
            'data1'          => $row['data1'] ?? null,
            'data2'          => $row['data2'] ?? null,
            'data3'          => $row['data3'] ?? null,
            'data4'          => $row['data4'] ?? null,
        ]);
    }

    /**
     * @return int
     */
    public function chunkSize(): int
    {
        // Implement chunked processing with 500 records per chunk as per project specifications
        return 500;
    }
}
