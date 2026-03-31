<?php

namespace App\Imports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;

class LogsImport implements ToModel, WithHeadingRow, WithChunkReading, SkipsEmptyRows, WithBatchInserts, WithValidation
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

        // Convert Excel serial date to Y-m-d H:i:s (optimized)
        $convertedDate = is_numeric($row['date_time'])
            ? Date::excelToDateTimeObject($row['date_time'])->format('Y-m-d H:i:s')
            : date('Y-m-d H:i:s', strtotime($row['date_time']));

        // Create new Log model for batch insertion
        return new Log([
            'fingerprint_id' => $row['fingerprint_id'],
            'date_time'      => $convertedDate,
            'data1'          => isset($row['data1']) ? (int)$row['data1'] : null,
            'data2'          => isset($row['data2']) ? (int)$row['data2'] : null,
            'data3'          => isset($row['data3']) ? (int)$row['data3'] : null,
            'data4'          => isset($row['data4']) ? (int)$row['data4'] : null,
        ]);
    }

    /**
     * @return int
     */
    public function batchSize(): int
    {
        // Optimized batch size for large imports
        return 2000;
    }

    /**
     * @return int
     */
    public function chunkSize(): int
    {
        // Chunk reading size
        return 2000;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'fingerprint_id' => 'required|string',
            'date_time' => 'required',
        ];
    }
}
